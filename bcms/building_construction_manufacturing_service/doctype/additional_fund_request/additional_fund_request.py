# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime,getdate
from frappe.utils import get_link_to_form, format_date, money_in_words
from frappe import _

class AdditionalFundRequest(Document):
	def validate(self):
		if self.workflow_state == "Fund Request":
			if self.requested_amount:
				self.db_set("suggested_by_building_department", self.requested_amount)
				self.db_set("suggested_by_building_department_in_words", money_in_words(self.suggested_by_building_department))
				self.db_set("suggested_by_member_incharge_pp", self.requested_amount)
				self.db_set("suggested_by_member_incharge_pp_in_words", money_in_words(self.suggested_by_member_incharge_pp))
				self.db_set("suggested_by_secretory_snm", self.requested_amount)
				self.db_set("suggested_by_secretory_snm_in_words",money_in_words(self.suggested_by_secretory_snm))
				self.db_set("amount_approved_by_member_incharge", self.requested_amount)
				self.db_set("amount_approved_by_member_incharge_a_and__f_in_words", money_in_words(self.amount_approved_by_member_incharge))
		# if self.requested_amount:
		# 	if not self.suggested_by_building_department:
		# 		self.suggested_by_building_department = self.requested_amount
		# 	if not self.suggested_by_member_incharge_pp:
		# 		self.suggested_by_member_incharge_pp = self.requested_amount
		# 	if not self.suggested_by_secretory_snm:
		# 		self.suggested_by_secretory_snm = self.requested_amount
		self.update_additional_fund_details()
		if self.requested_amount:
			self.validate_allocation_amount()
		if self.workflow_state == "Approved":
			project_doc = frappe.get_doc("Project", self.project)
			if project_doc.custom_additional_require_amount:
				project_doc.custom_additional_require_amount += self.amount_approved_by_member_incharge
			else:
				project_doc.custom_additional_require_amount = self.amount_approved_by_member_incharge
			project_doc.custom_additional_require_amount_in_words = money_in_words(project_doc.custom_additional_require_amount)
			if project_doc.workflow_state == "Work completion Certificate":
				project_doc.workflow_state = "Under Disbursement"
			project_doc.save()
			self.create_disbursement()

	def create_disbursement(self):
		current_sequence = frappe.db.get_value("Disbursement", {"project": self.project}, "max(sequence)") or 0
		disbursement = frappe.new_doc("Disbursement")
		disbursement.project = self.project
		disbursement.project_type = self.project_type
		disbursement.requested_amount = self.amount_approved_by_member_incharge
		disbursement.workflow_state = "Pending"
		disbursement.sequence = int(current_sequence) + 1
		disbursement.flags.from_project = True
		disbursement.flags.update_project = True
		disbursement.save()

	def validate_allocation_amount(self):
		currency = frappe.db.get_value("Global Defaults","Global Defaults","default_currency")
		if self.requested_amount:
			if self.suggested_by_building_department and self.suggested_by_building_department > self.requested_amount:
				frappe.throw(_(f"Suggested Amount cannot be exceed {currency} {self.requested_amount}"))
			if self.suggested_by_member_incharge_pp and self.suggested_by_member_incharge_pp > self.requested_amount:	
				frappe.throw(_(f"Suggested Amount cannot be exceed {currency} {self.requested_amount}"))
			if self.suggested_by_secretory_snm and self.suggested_by_secretory_snm > self.requested_amount:
				frappe.throw(_(f"Suggested Amount cannot be exceed {currency} {self.requested_amount}"))
			if self.amount_approved_by_member_incharge and self.amount_approved_by_member_incharge > self.requested_amount:
				frappe.throw(_(f"Suggested Amount cannot be exceed {currency} {self.requested_amount}"))
			
	def update_additional_fund_details(self):
		additional_fund_data = frappe.db.get_all("Additional Fund Request", {"project": self.project}, ["name", "requested_by", "requested_amount", "amount_approved_by_member_incharge", "workflow_state", "posting_date"], order_by = "posting_date")
		if not additional_fund_data:
			return
		custom_html =  """
			<table>
				<tr>
					<td><b>Request ID</b></td>
					<td><b>Requested By</b></td>
					<td><b>Requested On</b></td>
					<td><b>Requested Amount</b></td>
					<td><b>Approved Amount</b></td>
					<td><b>Approved By</b></td>
					<td><b>Button</b></td>
				</tr>
		"""
		for row in additional_fund_data:
			custom_html += f"""
				<tr>
					<td>{get_link_to_form("Additional Fund Request", row.name)}</td>
					<td>{row.requested_by}</td>
					<td>{format_date(row.posting_date)}</td>
					<td>{row.requested_amount}</td>
					<td>{row.amount_approved_by_member_incharge}</td>
					<td>{row.workflow_state}</td>
					<td><button class = "btn btn-primary btn-sm primary-action"><a style="color: white; font-weight: bold;" href="/app/additional-fund-request/{row.name}">Details</a></button></td>
				</tr>
			"""
		custom_html += "</table>"
		frappe.db.set_value("Project", self.project, "custom_additional_fund_request_detail", custom_html)
@frappe.whitelist()
def change_in_approve(docname,workflow_state):
	update_data={}
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Additional Fund Request"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	# state = workflow_state_map.get(workflow_state)
	update_data["workflow_state"] = workflow_state_map.get(workflow_state)
	current_user=frappe.session.user
	# doc=frappe.get_doc("Additional Fund Request", docname)
	if workflow_state=="Member Incharge BM (Finance Approval)":
		update_data["submission_date_bd"]= now_datetime()
		update_data["approved_by_bd"]  = current_user
	if workflow_state=="Member Incharge PP (Financial Approval)":
		update_data["submission_date_mi_pp"] = now_datetime()
		update_data["approved_by_mi_pp"] = current_user
	if workflow_state=="Secretary (Financial Approval)":
		update_data["approved_by_secretary"] = current_user
		update_data["submission_date_secretary"] = now_datetime()
	if workflow_state=="Member Incharge A&F(Financial Approval)":
		update_data["approved_by_af"] = current_user
		update_data["submission_date_af"] = now_datetime()
	frappe.db.set_value("Additional Fund Request", docname,update_data)
	frappe.get_doc("Additional Fund Request", docname).validate()
	return f"Additional Request is Approved"


@frappe.whitelist()
def reject_project(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Additional Fund Request"}, ["state", "next_state"])
	workflow_state_map = {row.next_state: row.state for row in workflow_data}
	if workflow_state in workflow_state_map:
		next_state = workflow_state_map.get(workflow_state)
		if next_state:
			frappe.db.set_value("Additional Fund Request", docname, "workflow_state", next_state)
			return f"Additional Fund Request is Rejected."
		else:
			return f"Cannot reject Additional Fund Request '{docname}' from state '{workflow_state}'."
	else:
		return f"Additional Fund Request '{docname}' is not in a valid state for rejection."