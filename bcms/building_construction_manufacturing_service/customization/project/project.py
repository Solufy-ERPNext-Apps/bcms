import frappe
import json
from frappe.utils import money_in_words
from frappe.utils import now_datetime
from frappe.model.mapper import get_mapped_doc


def validate(self, method=None):
    if self.workflow_state == "Under Disbursement":
        calculate_disbursement_and_remaining(self)


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
