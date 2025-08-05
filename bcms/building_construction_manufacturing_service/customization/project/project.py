import frappe
import json
from frappe.utils import money_in_words
from frappe.utils import now_datetime
from frappe.model.mapper import get_mapped_doc


def validate(self, method=None):
    validate_allocation_amount(self)
    if self.workflow_state == "Under Disbursement":
        calculate_disbursement_and_remaining(self)
    if self.custom_branch and self.workflow_state == "Project Request" and not self.custom_details_of_sewadal_details:
        unit_data = frappe.db.get_all("Unit", {"branch": self.custom_branch}, ["name", "ladies_satsang_strength", "gents_satsang_strength"])
        for row in unit_data:
            self.append("custom_details_of_sewadal_details", {
                "unit": row.name,
                "no_of_females": row.ladies_satsang_strength,
                "no_of_males": row.gents_satsang_strength,
                "strength_of_sewadal": row.ladies_satsang_strength + row.gents_satsang_strength
            })

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
    elif workflow_state == "Under Disbursement":
        update_data["custom_commitee_approved_by"] = current_user
        update_data["custom_commitee_submission_date"] = now_datetime()
    elif workflow_state == "Work completion Certificate":
        update_data["custom_work_approved_by"] = current_user
        update_data["custom_work_submission_date"] = now_datetime()

    frappe.db.set_value("Project", docname, update_data)
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


def create_disbursement(doc):
    if len(doc.custom_disbursement_planning) > 0:
        for row in doc.custom_disbursement_planning:
            disbursement = frappe.new_doc("Disbursement")
            disbursement.project = doc.name
            disbursement.project_type = doc.project_type
            disbursement.requested_amount  = row.amount
            disbursement.requested_by = frappe.session.user
            disbursement.save()
