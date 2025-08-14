import frappe
import json
from frappe.utils import money_in_words
from frappe.utils import now_datetime,getdate
from datetime import datetime
from frappe.model.mapper import get_mapped_doc
from frappe import _


def validate(self, method=None):
	validate_allocation_amount(self)
	currency = frappe.db.get_value("Global Defaults","Global Defaults","default_currency")
	if self.custom_total_estimated_cost:
		self.custom_total_estimated_cost_in_site = money_in_words(self.custom_total_estimated_cost)
	calculate_days(self)
	
	if self.workflow_state in ["Planning & Designing", "Drawing Approval", "Member Incharge BM (Finance Approval)", "Construction Committee Formed","Final Project Planning"]:
		set_bill_of_qty(self)
	if self.workflow_state == "Under Disbursement":
		if not frappe.db.exists("Disbursement", {"project": self.name,"disable":0}):
			create_disbursement(self)
		calculate_disbursement_and_remaining(self)
	if self.workflow_state == "Member Incharge BM (Finance Approval)":
		if self.custom_total_estimated_cost:
			self.db_set("custom_suggested_by_member_incharge_bm", self.custom_total_estimated_cost)
			self.db_set("custom_amount_in_words_in_bm", money_in_words(self.custom_suggested_by_member_incharge_bm))
			self.db_set("custom_suggested_by_member_incharge_pp", self.custom_total_estimated_cost)
			self.db_set("custom_amount_in_words_in_pp", money_in_words(self.custom_suggested_by_member_incharge_pp))
			self.db_set("custom_suggested_by_secretory_snm", self.custom_total_estimated_cost)
			self.db_set("custom_amount_in_words_snm", money_in_words(self.custom_suggested_by_secretory_snm))
			self.db_set("custom_suggested_by_member_incharge_a__f", self.custom_total_estimated_cost)
			self.db_set("custom_amount_in_words_a__f", money_in_words(self.custom_suggested_by_member_incharge_a__f))
	if self.custom_branch and self.workflow_state == "Project Request" and not self.custom_details_of_sewadal_details:
		unit_data = frappe.db.get_all("Unit", {"branch": self.custom_branch}, ["name", "ladies_satsang_strength", "gents_satsang_strength"])
		for row in unit_data:
			self.append("custom_details_of_sewadal_details", {
				"unit": row.name,
				"no_of_females": row.ladies_satsang_strength,
				"no_of_males": row.gents_satsang_strength,
				"strength_of_sewadal": row.ladies_satsang_strength + row.gents_satsang_strength
			})
	if self.custom_suggested_by_member_incharge_a__f:
		self.db_set("custom_approved_amount_by_a_and_finance",self.custom_suggested_by_member_incharge_a__f)
		self.db_set("custom_approved_amount_by_a_and_finance_in_words",money_in_words(self.custom_approved_amount_by_a_and_finance))
		self.db_set("custom_project_allocated_amount",self.custom_suggested_by_member_incharge_a__f)
		self.db_set("custom_approved_amount_by_a_and_finance_in_words",money_in_words(self.custom_project_allocated_amount))
	if self.custom_estimate_cost:
		self.db_set("custom_previously_suggested_code_of_mi",self.custom_estimate_cost)
		self.db_set("custom_previously_suggested_by_in_words", money_in_words(self.custom_estimate_cost))
	if self.workflow_state == "Final Project Planning":
		if self.custom_approved_amount_by_a_and_finance:
			if self.custom_total_boq_amount and self.custom_total_boq_amount > self.custom_approved_amount_by_a_and_finance:
				frappe.throw(_(f"Total Amount cannot exceed {currency} {self.custom_approved_amount_by_a_and_finance}"))



def set_bill_of_qty(self):
	total_amount = 0
	if (self.workflow_state in ["Member Incharge BM (Finance Approval)"] and not self.custom_bill_of_quantity_appoval) or self.workflow_state in ["Drawing Approval", "Planning & Designing"]:
		self.set("custom_bill_of_quantity_appoval", [])
		for row in self.custom_bill_of_quantity:
			total_amount += row.amount
			self.append("custom_bill_of_quantity_appoval", {
				"work": row.work,
				"area": row.area,
				"unit": row.unit,
				"quantity": row.quantity,
				"rate": row.rate,
				"amount": row.amount
			})
		self.custom_total_estimated_cost = total_amount
		self.custom_total_estimated_cost_in_site = money_in_words(self.custom_total_estimated_cost)
			
	elif (self.workflow_state in ["Final Project Planning"] and not self.custom_bill_of_quantities) or self.workflow_state == "Construction Committee Formed":
		
		self.set("custom_bill_of_quantities", [])
		for row in self.custom_bill_of_quantity_appoval:
			total_amount += row.amount
			self.append("custom_bill_of_quantities", {
				"work": row.work,
				"area": row.area,
				"unit": row.unit,
				"quantity": row.quantity,
				"rate": row.rate,
				"amount": row.amount
			})
			
		self.custom_total_boq_amount = total_amount
		self.custom_total_amount_in_word = money_in_words(self.custom_total_boq_amount)


def create_disbursement(self):
	count = 0
	for row in self.custom_disbursement_planning:
		count += 1
		if exists:=frappe.db.exists("Disbursement", {"project": self.name, "stage": row.state}):
			disbursement = frappe.get_doc("Disbursement",exists)
		else:
			disbursement = frappe.new_doc("Disbursement")
		disbursement.sequence = count
		disbursement.project = self.name
		disbursement.project_type = self.project_type
		disbursement.stage = row.state
		disbursement.disable = False
		disbursement.expected_start_date = row.expected_start_date
		disbursement.expected_end_date = row.expected_end_date
		disbursement.requested_amount  = row.amount
		disbursement.workflow_state = "Pending"
		disbursement.bank_account_name = self.custom_branch_bank_account_name
		if count == len(self.custom_disbursement_planning):
			disbursement.flags.update_project = True
		disbursement.flags.from_project = True
		disbursement.save()
	docs = frappe.get_all("Disbursement", {"project": self.name,"disable":1}, ["name"])
	for doc in docs:
		frappe.db.delete("Disbursement",doc.name)

def calculate_disbursement_and_remaining(self):
	self.custom_total_allocated_amount = (
		self.custom_project_allocated_amount + self.custom_additional_require_amount
	)
	self.custom_remaining_amount = (
		self.custom_total_allocated_amount - self.custom_disbursement_amount
	)


@frappe.whitelist()
def workflow_state(docname, project_type, workflow_state):
	update_data = {}
	workflow_data = frappe.db.get_all(
		"Workflow Transition", {"parent": project_type}, ["state", "next_state"]
	)
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	update_data["workflow_state"] = workflow_state_map.get(workflow_state)
	
	update_data["custom_approved_by"] = frappe.session.user
	update_data["custom_submission_date"] = now_datetime()

	current_user = frappe.session.user
	if workflow_state == "Project Request":
		update_data["custom_approved_by"] =  current_user
		update_data["custom_submission_date"] = now_datetime()
	elif workflow_state == "Building Site Verification":
		update_data["custom_verification_approved_by"] = current_user
		update_data["custom_verification_submission_date"] = now_datetime()
	elif workflow_state == "Under Process":
		update_data["custom_paint_work_approved_by"] = current_user
		update_data["custom_paint_work_submission_date"] = now_datetime()
	elif workflow_state == "Land Clearance":
		update_data["custom_land_purchase_approved_by"] = current_user
		update_data["custom_land_purchase_submission_date"] = now_datetime()
	elif workflow_state == "Planning & Designing":
		update_data["custom_planing_approved_by"] = current_user
		update_data["custom_planing_submission_date"] = now_datetime()
	elif workflow_state == "Drawing Approval":
		update_data["custom_approval_approved_by"] = current_user
		update_data["custom_approval_submission_date"] = now_datetime()
	elif workflow_state == "Member Incharge PP (Financial Approval)" :
		update_data["custom_fin_approved_by"] = current_user
		update_data["custom_fin_submission_date"] = now_datetime()
	elif workflow_state == "Secretary (Financial Approval)":
		update_data["custom_planing_approved_by"] = current_user
		update_data["custom_commitee_submission_date"] = now_datetime()
	elif workflow_state == "Member Incharge A&F(Financial Approval)":
		update_data["custom_approval_approved_by"] = current_user
		update_data["custom_approval_submission_date"] = now_datetime()
	elif workflow_state == "Construction Committee Formed":
		update_data["custom_commitee_approved_by"] = current_user
		update_data["custom_commitee_submission_date"] = now_datetime()
	elif workflow_state == "Final Project Planning":
		update_data["custom_final_project_approved_by"] = current_user
		update_data["custom_final_project_submission_date"] = now_datetime()
	elif workflow_state == "Work completion Certificate":
		update_data["custom_work_approved_by"] = current_user
		update_data["custom_work_submission_date"] = now_datetime()

	frappe.db.set_value("Project", docname, update_data)
	validate(frappe.get_doc("Project", docname))
	return f"Project Approved"


@frappe.whitelist()
def reject_project(docname, project_type, workflow_state):
	workflow_data = frappe.db.get_all(
		"Workflow Transition", {"parent": project_type}, ["state", "next_state"]
	)
	workflow_state_map = {row.next_state: row.state for row in workflow_data}
	if workflow_state in workflow_state_map:
		next_state = workflow_state_map.get(workflow_state)
		if next_state:
			reject_disbursement(docname, workflow_state)
			frappe.db.set_value("Project", docname, "workflow_state", next_state)
			return f"Project '{docname}' has been rejected."
		else:
			return f"Cannot reject project '{docname}' from state '{workflow_state}'."
	else:
		return f"Project '{docname}' is not in a valid state for rejection."


@frappe.whitelist()
def create_stock_entry_from_project(source_name, target_doc=None):
	def postprocess(source, target):
		target.company = source.company
		target.project = source.name

	doc = get_mapped_doc(
		"Project",
		source_name,
		{
			"Project": {
				"doctype": "Stock Entry",
			}
		},
		target_doc,
		postprocess,
	)
	return doc


@frappe.whitelist()
def get_amount_in_words(amount):
	try:
		return money_in_words(amount)
	except Exception as e:
		frappe.throw(_(f"Error converting to words: {e}"))


def validate_allocation_amount(self):
	currency = frappe.db.get_value("Global Defaults","Global Defaults","default_currency")
	if self.custom_total_estimated_cost:
		if self.custom_suggested_by_member_incharge_bm and self.custom_suggested_by_member_incharge_bm > self.custom_total_estimated_cost:
			frappe.throw(_(f"Suggested by Member Incharge (PP) cannot exceed {currency} {self.custom_total_estimated_cost}"))
		if self.custom_suggested_by_secretory_snm and self.custom_suggested_by_secretory_snm > self.custom_total_estimated_cost:
			frappe.throw(_(f"Suggested by Secretory SNM cannot exceed {currency} {self.custom_total_estimated_cost}"))
		if self.custom_suggested_by_member_incharge_pp and self.custom_suggested_by_member_incharge_pp > self.custom_total_estimated_cost:
			frappe.throw(_(f"Amount Approved by Member Incharge (A & F) cannot exceed {currency} {self.custom_total_estimated_cost}"))
#Mansi
@frappe.whitelist()
def calculate_days(self):
	if self.workflow_state == "Final Project Planning":
		if not self.custom_expected_start_dates or not self.custom_expected_end_dates:
			return 0
		from_date = datetime.strptime(str(self.custom_expected_start_dates), "%Y-%m-%d")
		to_date = datetime.strptime(str(self.custom_expected_end_dates), "%Y-%m-%d")
		if from_date > to_date:
			frappe.throw(_("Please select a valid date!"))
		self.custom_disburstment_duration = (to_date - from_date).days + 1
	if self.workflow_state == "Work completion Certificate":
		# if not self.custom_start_date_ or not self.custom_end_date:
		self.custom_start_date_ = getdate(self.creation)
		self.custom_end_date = getdate(now_datetime())    
		from_date = self.custom_start_date_
		to_date = self.custom_end_date
		if from_date > to_date:
			frappe.throw(_("Please select a valid date!"))
		self.custom_duration = (to_date - from_date).days + 1
#Riya
def reject_disbursement(docname, workflow_state):
	if workflow_state == "Under Disbursement":
		doc = frappe.get_doc("Project",docname)
		disbursement_docs = frappe.db.get_all("Disbursement",{"project": doc.name},["name","workflow_state"])
		if all(row.workflow_state == "Pending" for row in disbursement_docs):
			for row in disbursement_docs:
				disbursement = frappe.get_doc("Disbursement",row.name)
				disbursement.disable = True
				disbursement.save()

#Harsh
def validate_allocation_amount(self):
	if self.custom_land:
		zone = frappe.db.get_value("Land Details", self.custom_land, "zone")
		if zone:
			zone_name, mob_no, email, address = frappe.db.get_value("Zone", zone, ["zone_name", "zonal_incharge_mobile_no", "zone_email", "zonal_incharge_address"]
			)
			self.custom_recommendation_of_members = []
			self.append("custom_recommendation_of_members", {
				"name1": zone_name,
				"mob_no": mob_no,
				"email": email,
				"address": address
			})

#Harsh
def before_insert(doc, method):
	
	def add_if_empty(child_table_fieldname, child_doctype, default_values=None):
		if not doc.get(child_table_fieldname) or len(doc.get(child_table_fieldname)) == 0:
			child = doc.append(child_table_fieldname, None)
			if default_values:
				child.update(default_values)

	def add_default_rows_if_empty(child_table_fieldname, child_doctype, default_values_list):
		if not doc.get(child_table_fieldname) or len(doc.get(child_table_fieldname=None)) == 0:
			for values in (default_values_list or []):
				child = doc.append(child_table_fieldname, {} )
				child.update(values)
	

	# add_if_empty('custom_recommendation_letters', 'Recommendation Letter')
	add_if_empty('custom_site_plan', 'Site Plan')
	add_if_empty('custom_nearest_branch_details', 'Nearest Branch Details')
	add_if_empty('custom_details_of_sangat_', 'DETAILS OF SANGAT')
	add_if_empty('custom_details_of_sewadal_details', 'DETAILS OF SEWADAL DETAILS')
	add_if_empty('custom_blood_donation_record', 'Blood Donation Record')
	add_if_empty('custom_bill_of_quantity', 'Bill of Quantity')
	add_if_empty('custom_financiallll_approval', 'Financial Approval')
	add_if_empty('custom_construction_committee_', 'Construction Committee')
	add_if_empty('custom_land_details1', 'Land Details')
	add_if_empty('custom_standard_planning_and_designing111111', 'Standard Planning and Designing')
	add_if_empty('custom_drawing_covering_letter11111', 'Drawing Covering Letter')
	# add_if_empty('custom_drawing_file_all_blocks11', 'Attach Image for Govt Drawing File')
	add_if_empty('custom_boq_estimate11', 'BOQ/ Estimate')
	add_if_empty('custom_govt_approval_letter11111', 'Attach Image for Govt Approval')
	add_if_empty('custom_govt_approved_drawing_file11', 'Attach Image for Govt Drawing File')
	add_if_empty('custom_construction_committee_form11', 'Construction Committee Form')
	add_if_empty('custom_proforma_for_sadh_sangat_attach', 'Proforma for Sadh Sangat attach')
	add_if_empty('custom_work_completion_certificate11', 'Virtual Work Completion Certificate')
	add_if_empty('custom_actual_work_completion_certificate', 'Actual Work Completion Certificate')
	add_if_empty('custom_completion_attachment', 'Completion Attachment')

	default_rows = [
		{ "land_details": "Any River , Nalla, Railway lines, HT electricity line in KVA." },
		{ "land_details": "Temporary Electricity Connection install at site" },
		{ "land_details": "Land inspection ion by supervisor /Engineer of Building Department & Demarcation done by Supervisor /Engineer." },
		{ "land_details": "Drawing approval procedure from local Garam Panchayat/ Municipal Council/ Town Planner & other government departments." },
		{ "land_details": "Type of Soil." },
		{ "land_details": "Land level should be mentioned in letter." }
	]

	default_row = [
		{ "land_details": "Land possession of Sant Nirankari Mandal." },
		{ "land_details": "Land is free from the court case & other dispute." }
	]

	attach_rows = [
		{ "land_detail": "NOC approval procedure from National Highway Authorities." }
	]
	if doc.project_type != "Boundary Wall":
		default_rows.append({"land_details": "Boundary Wall Construction work completed." })
		attach_rows.append({"land_detail": "Setback for Bhawan Construction as per LGA and NSH." })

	add_default_rows_if_empty('custom_land_details_forms', 'Land Details Form', default_rows)
	add_default_rows_if_empty('custom_attachment_section_for_land_details', 'Attachment section for Land details', attach_rows)
	add_default_rows_if_empty('custom_land_detail_lc', 'Land Details', default_row)

