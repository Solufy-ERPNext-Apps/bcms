# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form, format_date, money_in_words, flt

class Disbursement(Document):
	def validate(self):
		if self.flags.from_project and self.flags.update_project:
			frappe.enqueue(update_disbursement_details, doc = self, queue='long', timeout=600, enqueue_after_commit=True)
		else:
			update_disbursement_details(self)
		if self.workflow_state == "Disbursed":
			project_doc = frappe.get_doc("Project", self.project)
			if project_doc.custom_disbursement_amount:
				project_doc.custom_disbursement_amount += self.disbursement_amount
			else:
				project_doc.custom_disbursement_amount = self.disbursement_amount
			project_doc.custom_disbursement_amount_in_words = money_in_words(project_doc.custom_disbursement_amount)
			project_doc.save()

		if self.workflow_state == "Expenditure":
			self.total_expense = sum(row.get('amount_manually') for row in self.expenditure_details)

			if self.total_expense > self.disbursement_amount:
				frappe.throw("Total expense cannot be greater than the disbursement amount.")

def update_disbursement_details(doc):
	disbursement_data = frappe.db.get_all("Disbursement", {"project": doc.project}, ["expected_end_date", "expected_start_date","stage", "requested_amount", "disbursement_amount", "workflow_state", "request_on", "sequence"], order_by = "sequence")
	if not disbursement_data:
		return
	custom_html =  """
		<table>
			<tr>
				<td><b>Stage</b></td>
				<td><b>Expected Start Date</b></td>
				<td><b>Expected End Date</b></td>
				<td><b>Requested On</b></td>
				<td><b>Requested Amount</b></td>
				<td><b>Disbursed Amount</b></td>
				<td><b>Status</b></td>
				<td><b>Percentage</b></td>
				<td><b>Button</b></td>
			</tr>
	"""
	current_req = True
	total_amount = sum(row.requested_amount for row in disbursement_data)
	for row in disbursement_data:
		if row.workflow_state != "Completed" and current_req:
			if row.workflow_state == "Pending":
				button = f"""<button style = "background-color: green" id = "request_transfer" data-name = "{row.name}" class = "btn btn-primary btn-sm primary-action"><u>Request Transfer</u></button>"""
			else:
				button = f"""<button style = "background-color: green" class = "btn btn-primary btn-sm primary-action"><a style="color: white; font-weight: bold;" href="/app/disbursement/{row.name}">Under Process</a></button>"""
			current_req = False
		else:
			button = f"""<button class = "btn btn-primary btn-sm primary-action"><a style="color: white; font-weight: bold;" href="/app/disbursement/{row.name}">Details</a></button>"""
		custom_html += f"""
			<tr>
				<td>{row.stage}</td>
				<td>{row.expected_start_date}</td>
				<td>{row.expected_end_date}</td>
				<td>{format_date(row.request_on)}</td>
				<td>{row.requested_amount}</td>
				<td>{row.disbursement_amount}</td>
				<td>{row.workflow_state}</td>
				<td>{flt(row.requested_amount * 100 / total_amount, 2)}</td>
				<td>{button}</td>
			</tr>
		"""
	custom_html += f"""</table>"""
	frappe.db.set_value("Project", doc.project, "custom_preview_disbursement_details", custom_html)



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
		return f"Disbursement is Approved"

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
