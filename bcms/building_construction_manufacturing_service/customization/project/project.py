import frappe
import json
from frappe.utils import money_in_words
from frappe.utils import now_datetime
from datetime import datetime
from frappe.model.mapper import get_mapped_doc


def validate(self, method=None):
    if self.custom_expected_start_dates and self.custom_expected_end_dates:
        calculate_days(self)
    validate_allocation_amount(self)
    if self.workflow_state in ["Drawing Approval", "Member Incharge BM (Finance Approval)", "Final Project Planning"]:
        set_bill_of_qty(self)
    if self.workflow_state == "Under Disbursement":
        if not frappe.db.exists("Disbursement", {"project": self.name}):
            create_disbursement(self)
        calculate_disbursement_and_remaining(self)
    if self.workflow_state == "Member Incharge PP (Financial Approval)":
        if self.custom_total_estimated_cost:
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


def set_bill_of_qty(self):
    total_amount = 0
    if self.workflow_state == "Member Incharge BM (Finance Approval)" and not self.custom_bill_of_quantity_appoval:
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
    elif self.workflow_state == "Final Project Planning" and not self.custom_bill_of_quantities:
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
        disbursement = frappe.new_doc("Disbursement")
        disbursement.project = self.name
        disbursement.project_type = self.project_type
        disbursement.stage = row.state
        disbursement.expected_start_date = row.expected_start_date
        disbursement.expected_end_date = row.expected_end_date
        disbursement.requested_amount  = row.amount
        disbursement.workflow_state = "Pending"
        disbursement.sequence = count
        if count == len(self.custom_disbursement_planning):
            disbursement.flags.update_project = True
        disbursement.flags.from_project = True
        disbursement.save()


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
        update_data["custom_fin_approved_by"] = current_user
        update_data["custom_commitee_submission_date"] = now_datetime()
    elif workflow_state == "Final Project Planning":
        update_data["custom_final_project_approved_by"] = current_user
        update_data["custom_final_project_submission_date"] = now_datetime()
    elif workflow_state == "Under Disbursement":
        update_data["custom_commitee_approved_by"] = current_user
        update_data["custom_commitee_submission_date"] = now_datetime()
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
        frappe.throw(f"Error converting to words: {e}")


def validate_allocation_amount(self):
    currency = frappe.db.get_value("Global Defaults","Global Defaults","default_currency")
    if self.custom_total_estimated_cost:
        if self.custom_suggested_by_member_incharge_pp and self.custom_suggested_by_member_incharge_pp > self.custom_total_estimated_cost:
            frappe.throw(f"Suggested by Member Incharge (PP) cannot exceed {currency} {self.custom_total_estimated_cost}")
        if self.custom_suggested_by_secretory_snm and self.custom_suggested_by_secretory_snm > self.custom_total_estimated_cost:
            frappe.throw(f"Suggested by Secretory SNM cannot exceed {currency} {self.custom_total_estimated_cost}")
        if self.custom_suggested_by_member_incharge_a__f and self.custom_suggested_by_member_incharge_a__f > self.custom_total_estimated_cost:
            frappe.throw(f"Amount Approved by Member Incharge (A & F) cannot exceed {currency} {self.custom_total_estimated_cost}")
    

@frappe.whitelist()
def calculate_days(self):
    if not self.custom_expected_start_dates or not self.custom_expected_end_dates:
        return 0
    from_date = datetime.strptime(str(self.custom_expected_start_dates), "%Y-%m-%d")
    to_date = datetime.strptime(str(self.custom_expected_end_dates), "%Y-%m-%d")

    if from_date > to_date:
        frappe.throw("Please select a valid date!")
    self.custom_disburstment_duration = (to_date - from_date).days + 1
    print((to_date - from_date).days + 1)