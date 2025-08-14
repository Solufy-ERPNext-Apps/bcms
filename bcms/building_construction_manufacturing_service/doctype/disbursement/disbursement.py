# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form, format_date, money_in_words, flt
from frappe import _

class Disbursement(Document):
	def validate(self):
		validate_disbursement_amount(self)
		disbursement_details(self)
		self.update_disbursement_amount()
		if self.flags.from_project and self.flags.update_project:
			frappe.enqueue(update_disbursement_details, doc = self, queue='long', timeout=600, enqueue_after_commit=True)
		else:
			update_disbursement_details(self)
		if self.workflow_state == "Expenditure":
			self.total_expense = sum(row.get('amount_manually') for row in self.expenditure_details)
			if self.total_expense:
				self.remaining_amount = self.disbursement_amount - self.total_expense + self.additional_amount
		if  self.workflow_state == "Member Incharge A&F(Financial Approval)":
			if self.disbursement_amount == 0:
				self.db_set("disbursement_amount", self.requested_amount)
	def on_update(self):
		self.set_amount_in_words()
	
	
	

	def update_disbursement_amount(self):
		if self.workflow_state == "Expenditure":
			if self.disbursement_amount:
				project = frappe.get_doc("Project", self.project)
				if not self.updated_value:
					project.custom_disbursement_amount += self.disbursement_amount
					print(":::::::::::::::::::::::::::::::::::::::::")
					self.db_set("updated_value", 1)
				project.save()

	
	@frappe.whitelist()
	def set_amount_in_words(self):
		if self.requested_amount:
			self.db_set("requested_amount_in_words", money_in_words(self.requested_amount))
		if self.disbursement_amount:
			self.db_set("disbursement_amount_in_words" ,money_in_words(self.disbursement_amount))
		if self.total_expense:
			self.db_set("total_expense_in_words" ,money_in_words(self.total_expense))
	
	
	@frappe.whitelist()
	def get_total_expense(self,method=None):
		expense = 0
		for row in self.expenditure_details:
			if row.amount_manually:
				expense += row.amount_manually
		self.db_set("total_expense", expense)
		
				

		
def update_disbursement_details(doc):
	disbursement_data = frappe.db.get_all("Disbursement", {"project": doc.project}, ["name","expected_end_date", "expected_start_date","stage", "requested_amount", "disbursement_amount", "workflow_state", "request_on", "sequence"], order_by = "sequence")
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
		elif row.workflow_state != "Completed":
			button = f"""<button class = "btn btn-primary btn-sm primary-action" style="color: white; font-weight: bold;">Details</button>"""
		else:
			button = f"""<button class = "btn btn-primary btn-sm primary-action"><a style="color: white; font-weight: bold;" href="/app/disbursement/{row.name}">Details</a></button>"""

		custom_html += f"""
			<tr>
				<td>{row.stage}</td>
				<td>{row.expected_start_date if row.expected_start_date else " - "}</td>
				<td>{row.expected_end_date if row.expected_end_date else " - "}</td>
				<td>{format_date(row.request_on) or ""}</td>
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
def change_in_approve(docname,workflow_state):
	workflow_data = frappe.db.get_all("Workflow Transition", {"parent": "Disbursement"}, ["state", "next_state"])
	workflow_state_map = {row.state: row.next_state for row in workflow_data}
	state = workflow_state_map.get(workflow_state)
	disbursement = frappe.get_doc("Disbursement", docname)
	
	if state:
		frappe.db.set_value("Disbursement", docname, "workflow_state", state)
		if state == "Member Incharge A&F(Financial Approval)":
			if disbursement.disbursement_amount == 0:
				frappe.db.set_value("Disbursement", docname, "disbursement_amount", disbursement.requested_amount)
		frappe.get_doc("Disbursement", docname).validate()
		update_add_amount(docname)
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


def disbursement_details(doc):
	disbursement_data = frappe.db.get_all("Disbursement", {"project": doc.project}, ["name","expected_end_date", "expected_start_date","stage", "requested_amount", "disbursement_amount", "workflow_state", "request_on", "sequence"], order_by = "sequence")
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
			</tr>
	"""
	current_req = True
	total_amount = sum(row.requested_amount for row in disbursement_data)
	for row in disbursement_data:
		custom_html += f"""
			<tr>
				<td>{row.stage}</td>
				<td>{row.expected_start_date if row.expected_start_date else " - "}</td>
				<td>{row.expected_end_date if row.expected_end_date else " - "}</td>
				<td>{format_date(row.request_on)}</td>
				<td>{row.requested_amount}</td>
				<td>{row.disbursement_amount}</td>
				<td>{row.workflow_state}</td>
				<td>{flt(row.requested_amount * 100 / total_amount, 2)}</td>
			</tr>
		"""
	custom_html += f"""</table>"""
	for row in disbursement_data:
		frappe.db.set_value("Disbursement",row.name,"disbursement_detail",custom_html)


def validate_disbursement_amount(doc):
	if doc.disbursement_amount and doc.requested_amount:
		if doc.disbursement_amount > doc.requested_amount:
			frappe.throw(_("Disbursement amount cannot be greater than requested amount."))


def update_add_amount(docname):
	doc = frappe.get_doc("Disbursement", docname)
	if doc.sequence == 1:
		doc.additional_amount = 0.00
	else:
		add_amount = frappe.db.get_value("Disbursement", {"project": doc.project, "sequence": doc.sequence - 1}, "remaining_amount")
		doc.additional_amount = add_amount if add_amount else 0.00
	doc.budget = doc.disbursement_amount + doc.additional_amount
	doc.save()


