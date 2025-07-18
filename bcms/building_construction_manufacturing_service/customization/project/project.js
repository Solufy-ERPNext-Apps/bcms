frappe.ui.form.on('Project', {
	custom_land_details_forms(frm) {
		const dialog = new frappe.ui.Dialog({
			title: 'Create / Update Land Details Document',
			fields: [
				{ label: 'Document Name', fieldname: 'docname', fieldtype: 'Data', hidden: true, default: '' },
				{ label: 'Land in the Name of Sant Nirankari Mandal', fieldname: 'land_in_the_name_of_sant_nirankari_mandal', fieldtype: 'Check' },
				{ label: 'Boundary Wall Construction Work Completed', fieldname: 'boundary_wall_construction_work_completed', fieldtype: 'Check' },
				{ label: 'Setback for Bhavan', fieldname: 'setback_for_bhavan', fieldtype: 'Check' },
				{ label: 'NOC Approval', fieldname: 'noc_approval', fieldtype: 'Check' },
				{ label: 'Land Inspection by Supervisor', fieldname: 'land_inspection_ion_by_supervisor', fieldtype: 'Check' },
				{ label: 'Drawing Approval', fieldname: 'drawing_approval', fieldtype: 'Check' },
				{ label: 'Any River', fieldname: 'any_river', fieldtype: 'Check' },
				{ label: 'Temporary Electricity', fieldname: 'temporary_electricity', fieldtype: 'Check' },
				{ label: 'Type of Soil', fieldname: 'type_of_soil', fieldtype: 'Check' },
				{ label: 'Land Level Should Be Mentioned in Letter', fieldname: 'land_level_should_be_mentioned_in_letter', fieldtype: 'Check' },
				{ label: 'Signature', fieldname: 'signature_wjjv', fieldtype: 'Signature' }
			],
			primary_action_label: 'Save',
			primary_action(values) {
				frappe.call({
					method: 'bcms.building_construction_manufacturing_service.customization.project.project.create_or_update_land_details_doc',
					args: { data: values },
					callback: (r) => {
						if (!r.exc) {
							const docname = r.message.name;
							frm.set_value('custom_land_details_form', docname);

							// Render preview HTML
							const table_html = `
								<style>
									.custom-details-table {
										width: 100%;
										border-collapse: collapse;
										font-family: Arial, sans-serif;
										font-size: 14px;
									}
									.custom-details-table th, .custom-details-table td {
										border: 1px solid #ccc;
										padding: 10px 12px;
									}
									.custom-details-table thead tr {
										background-color: #f7f7f7;
										font-weight: bold;
										text-align: left;
									}
									.custom-details-table tbody tr:nth-child(even) {
										background-color: #fafafa;
									}
									.custom-details-table td {
										vertical-align: middle;
									}
									.custom-details-table td img {
										max-height: 80px;
									}
								</style>
								<table class="custom-details-table">
									<tbody>
										<tr><td>Land in the Name of Sant Nirankari Mandal</td><td style="text-align:center;">${values.land_in_the_name_of_sant_nirankari_mandal ? 'Yes' : 'No'}</td></tr>
										<tr><td>Boundary Wall Construction Work Completed</td><td style="text-align:center;">${values.boundary_wall_construction_work_completed ? 'Yes' : 'No'}</td></tr>
										<tr><td>Setback for Bhavan</td><td style="text-align:center;">${values.setback_for_bhavan ? 'Yes' : 'No'}</td></tr>
										<tr><td>NOC Approval</td><td style="text-align:center;">${values.noc_approval ? 'Yes' : 'No'}</td></tr>
										<tr><td>Land Inspection by Supervisor</td><td style="text-align:center;">${values.land_inspection_ion_by_supervisor ? 'Yes' : 'No'}</td></tr>
										<tr><td>Drawing Approval</td><td style="text-align:center;">${values.drawing_approval ? 'Yes' : 'No'}</td></tr>
										<tr><td>Any River</td><td style="text-align:center;">${values.any_river ? 'Yes' : 'No'}</td></tr>
										<tr><td>Temporary Electricity</td><td style="text-align:center;">${values.temporary_electricity ? 'Yes' : 'No'}</td></tr>
										<tr><td>Type of Soil</td><td style="text-align:center;">${values.type_of_soil ? 'Yes' : 'No'}</td></tr>
										<tr><td>Land Level Should Be Mentioned in Letter</td><td style="text-align:center;">${values.land_level_should_be_mentioned_in_letter ? 'Yes' : 'No'}</td></tr>
										<tr><td>Zonal Incharge</td><td style="text-align:center;">${values.signature_wjjv ? `<img src="${values.signature_wjjv}" alt="Signature" />` : 'No'}</td></tr>
									</tbody>
								</table>`;

							frm.set_value('custom_land_details_preview', table_html);
							frm.refresh_fields(['custom_land_details_form', 'custom_land_details_preview']);

							setTimeout(() => {
								fix_text_editor_style(frm);
							}, 300);

							dialog.hide();
						}
					}
				});
			}
		});

		dialog.show();
	},

	refresh(frm) {
		setTimeout(() => {
			fix_text_editor_style(frm);
		}, 300);
	}
});

function fix_text_editor_style(frm) {
	if (!frm.fields_dict.custom_land_details_preview) return;

	const wrapper = frm.fields_dict.custom_land_details_preview.$wrapper;
	wrapper.find('.ql-toolbar').hide();

	const editor = wrapper.find('.ql-container');
	editor.css({
		'pointer-events': 'none',
		'background-color': 'transparent',
		'border': '1px solid #ccc',
		'box-shadow': 'none',
		'max-height': '600px',
		'height': 'auto',
		'overflow-y': 'auto',
		'width': '100%',
		'resize': 'vertical',
		'min-height': '300px'
	});

	wrapper.find('.ql-editor').css({
		'height': 'auto',
		'min-height': '300px',
		'max-height': '600px',
		'overflow': 'visible'
	});
}




///BOQ Estimate form listttttttttt
frappe.ui.form.on("Project", {
	custom_boqestimates: function (frm) {
		open_boq_estimate_dialog(frm);
	}
});

function open_boq_estimate_dialog(frm) {
	let boq_rows = [];
	let editing_index = null;

	const dialog = new frappe.ui.Dialog({
		title: "Create BOQ Estimate Form",
		fields: [
			{
				label: "Estimate For Construction Work Of Satsang Bhawan At",
				fieldname: "estimate_for_construction_work_of_satsang_bhawan_at",
				fieldtype: "Link",
				options: "Bhavan"
			},
			{
				label: "Total Amount",
				fieldname: "total_amount",
				fieldtype: "Int"
			},
			{ fieldtype: "Section Break", label: "Add BOQ Row" },
			{ label: "Work", fieldname: "work", fieldtype: "Data" },
			{ label: "Area", fieldname: "area", fieldtype: "Data" },
			{ label: "Rate", fieldname: "rate", fieldtype: "Float" },
			{ label: "Quantity", fieldname: "quantity", fieldtype: "Float" },
			{ label: "Unit", fieldname: "unit", fieldtype: "Link", options: "Unit" },
			{ label: "Amount", fieldname: "amount", fieldtype: "Int" },
			{
				fieldtype: "Button",
				label: "➕ Add Row to BOQ",
				fieldname: "add_row_btn",
				click() {
					const values = dialog.get_values();
					if (!values.work) {
						frappe.msgprint("❗ Please fill all BOQ fields.");
						return;
					}

					const new_row = {
						work: values.work,
						area: values.area,
						rate: values.rate,
						quantity: values.quantity,
						unit: values.unit,
						amount: values.amount || 0
					};

					if (editing_index !== null) {
						boq_rows[editing_index] = new_row;
						editing_index = null;
						dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to BOQ";
					} else {
						boq_rows.push(new_row);
					}

					update_preview_table();

					dialog.set_value("work", "");
					dialog.set_value("area", "");
					dialog.set_value("rate", "");
					dialog.set_value("quantity", "");
					dialog.set_value("unit", "");
					dialog.set_value("amount", "");
				}
			},
			{ fieldtype: "HTML", fieldname: "boq_table_preview" },
			{ fieldtype: "Hidden", fieldname: "project", default: frm.doc.name }
		],

		primary_action_label: "Create BOQ Estimate",
		primary_action(values) {
			if (boq_rows.length === 0) {
				frappe.msgprint("Please add at least one BOQ item.");
				return;
			}

			let html = `
				<div>
					<p><b>Bhavan:</b> ${values.estimate_for_construction_work_of_satsang_bhawan_at}</p>
					<p><b>Total Amount:</b> ₹ ${values.total_amount}</p>
					<table style="width:100%; border-collapse: collapse; margin-top:10px;" border="1" cellpadding="8" cellspacing="0">
						<thead style="background-color: #eaeaea;">
						  <tr>
							<td style="text-align:left; font-weight: bold;">Work</td>
							<td style="text-align:left; font-weight: bold;">Area</td>
							<td style="text-align:left; font-weight: bold;">Rate</td>
							<td style="text-align:left; font-weight: bold;">Quantity</td>
							<td style="text-align:left; font-weight: bold;">Unit</td>
							<td style="text-align:left; font-weight: bold;">Amount</td>
						</tr>
						</thead>
						<tbody>`;

			boq_rows.forEach(row => {
				html += `
					<tr>
						<td>${row.work}</td>
						<td>${row.area}</td>
						<td>${row.rate}</td>
						<td>${row.quantity}</td>
						<td>${row.unit || ""}</td>
						<td>${row.amount}</td>
					</tr>`;
			});

			html += `</tbody></table></div>`;

			const doc_data = {
				doctype: "BOQ Estimate Form",
				project: values.project,
				estimate_for_construction_work_of_satsang_bhawan_at: values.estimate_for_construction_work_of_satsang_bhawan_at,
				total_amount: values.total_amount,
				bill_of_quantity: boq_rows
			};

			frappe.call({
				method: "frappe.client.insert",
				args: { doc: doc_data },
				callback: function (r) {
					if (!r.exc) {
						const boq_name = r.message.name;
						frappe.msgprint("✅ BOQ Estimate Form created: " + boq_name);
						dialog.hide();
						frappe.call({
							method: "frappe.client.set_value",
							args: {
								doctype: "Project",
								name: frm.doc.name,
								fieldname: "custom_boqestimate_previous",
								value: html
							},
							callback: function () {
								frm.reload_doc();
							}
						});
						frappe.call({
							method: "frappe.client.set_value",
							args: {
								doctype: "Project",
								name: frm.doc.name,
								fieldname: "custom_boqestimate_form",
								value: boq_name
							}
						});
						
					}
				}
			});
		}
	});

	dialog.show();

	function update_preview_table() {
		let html = `
			<table class="table table-bordered" style="margin-top:15px;">
				<thead>
					<tr>
						<th>Work</th>
						<th>Area</th>
						<th>Rate</th>
						<th>Quantity</th>
						<th>Unit</th>
						<th>Amount</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>`;

		boq_rows.forEach((row, index) => {
			html += `<tr>
				<td>${row.work}</td>
				<td>${row.area}</td>
				<td>${row.rate}</td>
				<td>${row.quantity}</td>
				<td>${row.unit || ""}</td>
				<td>${row.amount}</td>
				<td>
					<button class="btn btn-sm btn-primary edit-row" data-index="${index}">Edit</button>
					<button class="btn btn-sm btn-danger delete-row" data-index="${index}">Delete</button>
				</td>
			</tr>`;
		});

		html += "</tbody></table>";

		dialog.fields_dict.boq_table_preview.$wrapper.html(html);
		dialog.fields_dict.boq_table_preview.$wrapper.find(".edit-row").on("click", function () {
			editing_index = parseInt($(this).data("index"));
			const row = boq_rows[editing_index];
			dialog.set_value("work", row.work);
			dialog.set_value("area", row.area);
			dialog.set_value("rate", row.rate);
			dialog.set_value("quantity", row.quantity);
			dialog.set_value("unit", row.unit);
			dialog.set_value("amount", row.amount);
			dialog.fields_dict.add_row_btn.input.innerText = "🔄 Update Row";
		});

		dialog.fields_dict.boq_table_preview.$wrapper.find(".delete-row").on("click", function () {
			const idx = parseInt($(this).data("index"));
			boq_rows.splice(idx, 1);
			editing_index = null;
			dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to BOQ";
			dialog.set_value("work", "");
			dialog.set_value("area", "");
			dialog.set_value("rate", "");
			dialog.set_value("quantity", "");
			dialog.set_value("unit", "");
			dialog.set_value("amount", "");
			update_preview_table();
		});
	}
}

frappe.ui.form.on('Project', {
	refresh(frm) {
		setTimeout(() => {
			fix_text_editor_style(frm);
		}, 500);
	}
});

function fix_text_editor_style(frm) {
	if (!frm.fields_dict.custom_boqestimate_previous) return;

	const wrapper = frm.fields_dict.custom_boqestimate_previous.$wrapper;

	wrapper.find('.ql-toolbar').hide();

	const editor = wrapper.find('.ql-container');
	editor.css({
		'pointer-events': 'none',
		'background-color': 'transparent',
		'border': '1px solid #ccc',
		'box-shadow': 'none',
		'max-height': '600px',
		'height': 'auto',
		'overflow-y': 'auto',
		'overflow-x': 'hidden',
		'width': '100%',
		'resize': 'vertical',
		'min-height': '300px'
	});

	wrapper.find('.ql-editor').css({
		'height': 'auto',
		'min-height': '300px',
		'max-height': '600px',
		'overflow': 'visible'
	});
}


//financial approval form
// Final Updated Code for Financial Approval Form

frappe.ui.form.on("Project", {
	custom_financial_approvals(frm) {
		open_dialog(frm);
	},

	refresh(frm) {
		setTimeout(() => {
			fix_text_editor_style(frm);
		}, 500);
	}
});

function open_dialog(frm) {
	let boq_rows = [];
	let editing_index = null;

	const dialog = new frappe.ui.Dialog({
		title: "Create Financial Approval Form",
		fields: [
			{ label: "Ref No.", fieldname: "refno", fieldtype: "Data" },
			{ label: "Work of Satsang Bhavan at", fieldname: "satsang_bhavan", fieldtype: "Link", options: "Bhavan" },
			{ label: "Date", fieldname: "dates", fieldtype: "Date" },
			{ label: "Total Amount", fieldname: "total_amount", fieldtype: "Int" },
			{ fieldtype: "Section Break", label: "Add Financial Details Row" },
			{ label: "District Name", fieldname: "distict_name", fieldtype: "Link", options: "District" },
			{ label: "State Name", fieldname: "state_name", fieldtype: "Link", options: "State" },
			{ label: "Zone", fieldname: "zone", fieldtype: "Link", options: "Zone" },
			{ label: "Estimated Cost", fieldname: "estimated_cost", fieldtype: "Int" },
			{ label: "Zone Name", fieldname: "zone_name", fieldtype: "Data" },
			{ label: "Remarks", fieldname: "remarks", fieldtype: "Small Text" },
			{
				fieldtype: "Button",
				label: "➕ Add Row to Financial Approval Form",
				fieldname: "add_row_btn",
				click() {
					const values = dialog.get_values();
					if (!values.zone) {
						frappe.msgprint("❗ Please fill all Financial Approval fields.");
						return;
					}

					const new_row = {
						distict_name: values.distict_name,
						state_name: values.state_name,
						zone: values.zone,
						estimated_cost: values.estimated_cost,
						zone_name: values.zone_name,
						remarks: values.remarks
					};

					if (editing_index !== null) {
						boq_rows[editing_index] = new_row;
						editing_index = null;
						dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to Financial Approval Form";
					} else {
						boq_rows.push(new_row);
					}

					update_preview_table();

					dialog.set_value("distict_name", "");
					dialog.set_value("state_name", "");
					dialog.set_value("zone", "");
					dialog.set_value("estimated_cost", "");
					dialog.set_value("zone_name", "");
					dialog.set_value("remarks", "");
				}
			},
			{ fieldtype: "HTML", fieldname: "boq_table_preview" },
			{ fieldtype: "Hidden", fieldname: "project", default: frm.doc.name }
		],

		primary_action_label: "Create Financial Approvals",
		primary_action(values) {
			if (boq_rows.length === 0) {
				frappe.msgprint("Please add at least one item.");
				return;
			}

			let html = `
				<div>
					<p><b>Ref No.:</b> ${values.refno}</p>
					<p><b>Estimate For Construction Work Of Satsang Bhawan At:</b> ${values.satsang_bhavan}</p> 
					<p><b>Date:</b> ${values.dates}</p>
					<p><b>Total Amount:</b> ${values.total_amount}</p>
					<table style="width:100%; border-collapse: collapse; margin-top:10px;" border="1" cellpadding="8" cellspacing="0">
						<thead style="background-color: #eaeaea;">
						  <tr>
							<td><b>District Name</b></td>
							<td><b>State Name</b></td>
							<td><b>Zone</b></td>
							<td><b>Estimated Cost</b></td>
							<td><b>Zone Name</b></td>
							<td><b>Remarks</b></td>
						</tr>
						</thead>
						<tbody>`;

			boq_rows.forEach(row => {
				html += `
					<tr>
						<td>${row.distict_name}</td>
						<td>${row.state_name}</td>
						<td>${row.zone}</td>
						<td>${row.estimated_cost}</td>
						<td>${row.zone_name || ""}</td>
						<td>${row.remarks}</td>
					</tr>`;
			});

			html += `</tbody></table></div>`;

			const doc_data = {
				doctype: "Financial Approval Form",
				project: values.project,
				refno: values.refno,
				satsang_bhavan: values.satsang_bhavan,
				dates: values.dates,
				total_amount: values.total_amount,
				financial_approvals: boq_rows
			};

			frappe.call({
				method: "frappe.client.insert",
				args: { doc: doc_data },
				callback(r) {
					if (!r.exc) {
						const docname = r.message.name;

						frappe.call({
							method: "frappe.client.set_value",
							args: {
								doctype: "Project",
								name: frm.doc.name,
								fieldname: "custom_financial_approval_preview",
								value: html
							},
							callback: function () {
								frm.reload_doc();
							}
						});

						frappe.call({
							method: "frappe.client.set_value",
							args: {
								doctype: "Project",
								name: frm.doc.name,
								fieldname: "custom_fin_aproval_id",
								value: docname
							}
						});

						dialog.hide();
					}
				}
			});
		}
	});

	dialog.show();

	setTimeout(() => {
		dialog.$wrapper.css({
			"display": "flex",
			"align-items": "center",
			"justify-content": "center",
			"padding": "10px",
			"height": "100vh",
			"overflow": "hidden"
		});

		dialog.$wrapper.find('.modal-dialog').css({
			"max-width": "900px",
			"width": "80%",
			"max-height": "80vh",
			"margin": "auto"
		});

		dialog.$wrapper.find('.modal-content').css({
			"max-height": "80vh",
			"overflow-y": "auto"
		});
	}, 100);

	function update_preview_table() {
		let html = `
			<table class="table table-bordered" style="margin-top:15px;">
				<thead>
					<tr>
						<th>District</th>
						<th>State</th>
						<th>Zone</th>
						<th>Estimated Cost</th>
						<th>Zone Name</th>
						<th>Remarks</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>`;

		boq_rows.forEach((row, index) => {
			html += `<tr>
				<td>${row.distict_name}</td>
				<td>${row.state_name}</td>
				<td>${row.zone}</td>
				<td>${row.estimated_cost}</td>
				<td>${row.zone_name}</td>
				<td>${row.remarks}</td>
				<td>
					<button class="btn btn-sm btn-primary edit-row" data-index="${index}">Edit</button>
					<button class="btn btn-sm btn-danger delete-row" data-index="${index}">Delete</button>
				</td>
			</tr>`;
		});

		html += `</tbody></table>`;

		dialog.fields_dict.boq_table_preview.$wrapper.html(html);

		dialog.fields_dict.boq_table_preview.$wrapper.find(".edit-row").on("click", function () {
			editing_index = parseInt($(this).data("index"));
			const row = boq_rows[editing_index];
			dialog.set_value("distict_name", row.distict_name);
			dialog.set_value("state_name", row.state_name);
			dialog.set_value("zone", row.zone);
			dialog.set_value("estimated_cost", row.estimated_cost);
			dialog.set_value("zone_name", row.zone_name);
			dialog.set_value("remarks", row.remarks);
			dialog.fields_dict.add_row_btn.input.innerText = "🔄 Update Row";
		});

		dialog.fields_dict.boq_table_preview.$wrapper.find(".delete-row").on("click", function () {
			const idx = parseInt($(this).data("index"));
			boq_rows.splice(idx, 1);
			editing_index = null;
			dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to Financial Approval Form";
			dialog.set_value("distict_name", "");
			dialog.set_value("state_name", "");
			dialog.set_value("zone", "");
			dialog.set_value("estimated_cost", "");
			dialog.set_value("zone_name", "");
			dialog.set_value("remarks", "");
			update_preview_table();
		});
	}
}

function fix_text_editor_style(frm) {
	if (!frm.fields_dict.custom_financial_approval_preview) return;

	const wrapper = frm.fields_dict.custom_financial_approval_preview.$wrapper;
	wrapper.find('.ql-toolbar').hide();

	const editor = wrapper.find('.ql-container');
	editor.css({
		'pointer-events': 'none',
		'background-color': 'transparent',
		'border': '1px solid #ccc',
		'box-shadow': 'none',
		'max-height': '800px',
		'height': 'auto',
		'overflow-y': 'auto',
		'overflow-x': 'hidden',
		'width': '100%',
		'resize': 'vertical',
		'min-height': '300px'
	});

	wrapper.find('.ql-editor').css({
		'height': 'auto',
		'min-height': '300px',
		'max-height': '600px',
		'overflow': 'visible'
	});
}