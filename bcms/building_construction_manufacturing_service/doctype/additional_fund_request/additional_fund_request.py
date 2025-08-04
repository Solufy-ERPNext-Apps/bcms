# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form, format_date

class AdditionalFundRequest(Document):
	def validate(self):
		self.update_additional_fund_details()
		if self.workflow_state == "Approved":
			project_doc = frappe.get_doc("Project", self.project)
			if project_doc.custom_additional_require_amount:
				project_doc.custom_additional_require_amount += self.amount_approved_by_member_incharge
			else:
				project_doc.custom_additional_require_amount = self.amount_approved_by_member_incharge
			if project_doc.workflow_state == "Work completion Certificate":
				project_doc.workflow_state = "Under Disbursement"
			project_doc.save()
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
				</tr>
			"""
		custom_html += "</table>"
		frappe.db.set_value("Project", self.project, "custom_additional_fund_request_detail", custom_html)
@frappe.whitelist()
def change_in_approve(docname,workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Additional Fund Request"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	if state:
		frappe.db.set_value("Additional Fund Request", docname, "workflow_state", state)
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