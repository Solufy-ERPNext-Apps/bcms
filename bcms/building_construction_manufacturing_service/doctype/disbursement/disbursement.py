# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form, format_date, money_in_words

class Disbursement(Document):
	def validate(self):
		self.update_disbursement_details()
		if self.workflow_state == "Completed":
			project_doc = frappe.get_doc("Project", self.project)
			if project_doc.custom_disbursement_amount:
				project_doc.custom_disbursement_amount += self.disbursement_amount
			else:
				project_doc.custom_disbursement_amount = self.disbursement_amount
			project_doc.save()
		
		if self.workflow_state == "Expenditure":
			self.total_expense = sum(row.get('amount_manually') for row in self.expenditure_details)

			if self.total_expense > self.disbursement_amount:
				frappe.throw("Total expense cannot be greater than the disbursement amount.")

	def update_disbursement_details(self):
		disbursement_data = frappe.db.get_all("Disbursement", {"project": self.project}, ["name", "requested_by", "disbursement_amount", "workflow_state", "request_on"], order_by = "request_on")
		if not disbursement_data:
			return
		custom_html =  """
			<table>
				<tr>
					<td><b>Disbursement ID</b></td>
					<td><b>Requested By</b></td>
					<td><b>Requested On</b></td>
					<td><b>Requested Amount</b></td>
					<td><b>Disbursed Amount</b></td>
					<td><b>Disbursed By</b></td>
				</tr>
		"""
		for row in disbursement_data:
			custom_html += f"""
				<tr>
					<td>{get_link_to_form("Disbursement", row.name)}</td>
					<td>{row.requested_by}</td>
					<td>{format_date(row.request_on)}</td>
					<td>{row.disbursement_amount}</td>
					<td>{row.disbursement_amount}</td>
					<td>{row.workflow_state}</td>
				</tr>
			"""
		custom_html += "</table>"
		frappe.db.set_value("Project", self.project, "custom_preview_disbursement_details", custom_html)
@frappe.whitelist()
def get_amount_in_words(amount):
	try:
		return money_in_words(amount)
	except Exception as e:
		frappe.throw(f"Error converting to words: {e}")
@frappe.whitelist()
def change_in_approve(docname,workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Disbursement"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	if state:
		frappe.db.set_value("Disbursement", docname, "workflow_state", state)
		frappe.get_doc("Disbursement", docname).validate()
		return f"Additional Request is Approved"

@frappe.whitelist()
def reject_project(docname, workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Disbursement"}, ["state", "next_state"])
	workflow_state_map = {row.next_state: row.state for row in workflow_data}
	if workflow_state in workflow_state_map:
		next_state = workflow_state_map.get(workflow_state)
		if next_state:
			frappe.db.set_value("Disbursement", docname, "workflow_state", next_state)
			return f"Disbursement is Rejected."
		else:
			return f"Cannot reject Disbursement '{docname}' from state '{workflow_state}'."
	else:
		return f"Disbursement '{docname}' is not in a valid state for rejection."
