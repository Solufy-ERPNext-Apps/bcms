frappe.ui.form.on("Project", {
	refresh: function(frm) {
		cur_frm.remove_custom_button('Set Project Status','Actions')
		cur_frm.remove_custom_button('Duplicate Project with Tasks', 'Actions');
		cur_frm.remove_custom_button('Update Total Purchase Cost', 'Actions'); 
		cur_frm.remove_custom_button('Set Project Status', 'Actions');
		cur_frm.remove_custom_button('Gantt Chart', 'View');
		cur_frm.remove_custom_button('Kanban Board', 'View');
	}
});






///BOQ Estimate form listttttttttt
// frappe.ui.form.on("Project", {
// 	custom_boqestimates: function (frm) {
// 		open_boq_estimate_dialog(frm);
// 	}
// });

// function open_boq_estimate_dialog(frm) {
// 	let boq_rows = [];
// 	let editing_index = null;

// 	const dialog = new frappe.ui.Dialog({
// 		title: "Create BOQ Estimate Form",
// 		fields: [
// 			{
// 				label: "Estimate For Construction Work Of Satsang Bhawan At",
// 				fieldname: "estimate_for_construction_work_of_satsang_bhawan_at",
// 				fieldtype: "Link",
// 				options: "Bhavan"
// 			},
// 			{
// 				label: "Total Amount",
// 				fieldname: "total_amount",
// 				fieldtype: "Int"
// 			},
// 			{ fieldtype: "Section Break", label: "Add BOQ Row" },
// 			{ label: "Work", fieldname: "work", fieldtype: "Data" },
// 			{ label: "Area", fieldname: "area", fieldtype: "Data" },
// 			{ label: "Rate", fieldname: "rate", fieldtype: "Float" },
// 			{ label: "Quantity", fieldname: "quantity", fieldtype: "Float" },
// 			{ label: "Unit", fieldname: "unit", fieldtype: "Link", options: "Unit" },
// 			{ label: "Amount", fieldname: "amount", fieldtype: "Int" },
// 			{
// 				fieldtype: "Button",
// 				label: "➕ Add Row to BOQ",
// 				fieldname: "add_row_btn",
// 				click() {
// 					const values = dialog.get_values();
// 					if (!values.work) {
// 						frappe.msgprint("❗ Please fill all BOQ fields.");
// 						return;
// 					}

// 					const new_row = {
// 						work: values.work,
// 						area: values.area,
// 						rate: values.rate,
// 						quantity: values.quantity,
// 						unit: values.unit,
// 						amount: values.amount || 0
// 					};

// 					if (editing_index !== null) {
// 						boq_rows[editing_index] = new_row;
// 						editing_index = null;
// 						dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to BOQ";
// 					} else {
// 						boq_rows.push(new_row);
// 					}

// 					update_preview_table();

// 					dialog.set_value("work", "");
// 					dialog.set_value("area", "");
// 					dialog.set_value("rate", "");
// 					dialog.set_value("quantity", "");
// 					dialog.set_value("unit", "");
// 					dialog.set_value("amount", "");
// 				}
// 			},
// 			{ fieldtype: "HTML", fieldname: "boq_table_preview" },
// 			{ fieldtype: "Hidden", fieldname: "project", default: frm.doc.name }
// 		],

// 		primary_action_label: "Create BOQ Estimate",
// 		primary_action(values) {
// 			if (boq_rows.length === 0) {
// 				frappe.msgprint("Please add at least one BOQ item.");
// 				return;
// 			}

// 			let html = `
// 				<div>
// 					<p><b>Bhavan:</b> ${values.estimate_for_construction_work_of_satsang_bhawan_at}</p>
// 					<p><b>Total Amount:</b> ₹ ${values.total_amount}</p>
// 					<table style="width:100%; border-collapse: collapse; margin-top:10px;" border="1" cellpadding="8" cellspacing="0">
// 						<thead style="background-color: #eaeaea;">
// 						  <tr>
// 							<td style="text-align:left; font-weight: bold;">Work</td>
// 							<td style="text-align:left; font-weight: bold;">Area</td>
// 							<td style="text-align:left; font-weight: bold;">Rate</td>
// 							<td style="text-align:left; font-weight: bold;">Quantity</td>
// 							<td style="text-align:left; font-weight: bold;">Unit</td>
// 							<td style="text-align:left; font-weight: bold;">Amount</td>
// 						</tr>
// 						</thead>
// 						<tbody>`;

// 			boq_rows.forEach(row => {
// 				html += `
// 					<tr>
// 						<td>${row.work}</td>
// 						<td>${row.area}</td>
// 						<td>${row.rate}</td>
// 						<td>${row.quantity}</td>
// 						<td>${row.unit || ""}</td>
// 						<td>${row.amount}</td>
// 					</tr>`;
// 			});

// 			html += `</tbody></table></div>`;

// 			const doc_data = {
// 				doctype: "BOQ Estimate Form",
// 				project: values.project,
// 				estimate_for_construction_work_of_satsang_bhawan_at: values.estimate_for_construction_work_of_satsang_bhawan_at,
// 				total_amount: values.total_amount,
// 				bill_of_quantity: boq_rows
// 			};

// 			frappe.call({
// 				method: "frappe.client.insert",
// 				args: { doc: doc_data },
// 				callback: function (r) {
// 					if (!r.exc) {
// 						const boq_name = r.message.name;
// 						frappe.msgprint("✅ BOQ Estimate Form created: " + boq_name);
// 						dialog.hide();
// 						frappe.call({
// 							method: "frappe.client.set_value",
// 							args: {
// 								doctype: "Project",
// 								name: frm.doc.name,
// 								fieldname: "custom_boqestimate_previous",
// 								value: html
// 							},
// 							callback: function () {
// 								frm.reload_doc();
// 							}
// 						});
// 						frappe.call({
// 							method: "frappe.client.set_value",
// 							args: {
// 								doctype: "Project",
// 								name: frm.doc.name,
// 								fieldname: "custom_boqestimate_form",
// 								value: boq_name
// 							}
// 						});
						
// 					}
// 				}
// 			});
// 		}
// 	});

// 	dialog.show();

// 	function update_preview_table() {
// 		let html = `
// 			<table class="table table-bordered" style="margin-top:15px;">
// 				<thead>
// 					<tr>
// 						<th>Work</th>
// 						<th>Area</th>
// 						<th>Rate</th>
// 						<th>Quantity</th>
// 						<th>Unit</th>
// 						<th>Amount</th>
// 						<th>Actions</th>
// 					</tr>
// 				</thead>
// 				<tbody>`;

// 		boq_rows.forEach((row, index) => {
// 			html += `<tr>
// 				<td>${row.work}</td>
// 				<td>${row.area}</td>
// 				<td>${row.rate}</td>
// 				<td>${row.quantity}</td>
// 				<td>${row.unit || ""}</td>
// 				<td>${row.amount}</td>
// 				<td>
// 					<button class="btn btn-sm btn-primary edit-row" data-index="${index}">Edit</button>
// 					<button class="btn btn-sm btn-danger delete-row" data-index="${index}">Delete</button>
// 				</td>
// 			</tr>`;
// 		});

// 		html += "</tbody></table>";

// 		dialog.fields_dict.boq_table_preview.$wrapper.html(html);
// 		dialog.fields_dict.boq_table_preview.$wrapper.find(".edit-row").on("click", function () {
// 			editing_index = parseInt($(this).data("index"));
// 			const row = boq_rows[editing_index];
// 			dialog.set_value("work", row.work);
// 			dialog.set_value("area", row.area);
// 			dialog.set_value("rate", row.rate);
// 			dialog.set_value("quantity", row.quantity);
// 			dialog.set_value("unit", row.unit);
// 			dialog.set_value("amount", row.amount);
// 			dialog.fields_dict.add_row_btn.input.innerText = "🔄 Update Row";
// 		});

// 		dialog.fields_dict.boq_table_preview.$wrapper.find(".delete-row").on("click", function () {
// 			const idx = parseInt($(this).data("index"));
// 			boq_rows.splice(idx, 1);
// 			editing_index = null;
// 			dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to BOQ";
// 			dialog.set_value("work", "");
// 			dialog.set_value("area", "");
// 			dialog.set_value("rate", "");
// 			dialog.set_value("quantity", "");
// 			dialog.set_value("unit", "");
// 			dialog.set_value("amount", "");
// 			update_preview_table();
// 		});
// 	}
// }

// frappe.ui.form.on('Project', {
// 	refresh(frm) {
// 		setTimeout(() => {
// 			fix_text_editor_style(frm);
// 		}, 500);
// 	}
// });

// function fix_text_editor_style(frm) {
// 	if (!frm.fields_dict.custom_boqestimate_previous) return;

// 	const wrapper = frm.fields_dict.custom_boqestimate_previous.$wrapper;

// 	wrapper.find('.ql-toolbar').hide();

// 	const editor = wrapper.find('.ql-container');
// 	editor.css({
// 		'pointer-events': 'none',
// 		'background-color': 'transparent',
// 		'border': '1px solid #ccc',
// 		'box-shadow': 'none',
// 		'max-height': '600px',
// 		'height': 'auto',
// 		'overflow-y': 'auto',
// 		'overflow-x': 'hidden',
// 		'width': '100%',
// 		'resize': 'vertical',
// 		'min-height': '300px'
// 	});

// 	wrapper.find('.ql-editor').css({
// 		'height': 'auto',
// 		'min-height': '300px',
// 		'max-height': '600px',
// 		'overflow': 'visible'
// 	});
// }


//financial approval form
// Final Updated Code for Financial Approval Form

// frappe.ui.form.on("Project", {
// 	custom_financial_approvals(frm) {
// 		open_dialog(frm);
// 	},

// 	refresh(frm) {
// 		setTimeout(() => {
// 			fix_text_editor_style(frm);
// 		}, 500);
// 	}
// });

// function open_dialog(frm) {
// 	let boq_rows = [];
// 	let editing_index = null;

// 	const dialog = new frappe.ui.Dialog({
// 		title: "Create Financial Approval Form",
// 		fields: [
// 			{ label: "Ref No.", fieldname: "refno", fieldtype: "Data" },
// 			{ label: "Work of Satsang Bhavan at", fieldname: "satsang_bhavan", fieldtype: "Link", options: "Bhavan" },
// 			{ label: "Date", fieldname: "dates", fieldtype: "Date" },
// 			{ label: "Total Amount", fieldname: "total_amount", fieldtype: "Int" },
// 			{ fieldtype: "Section Break", label: "Add Financial Details Row" },
// 			{ label: "District Name", fieldname: "distict_name", fieldtype: "Link", options: "District" },
// 			{ label: "State Name", fieldname: "state_name", fieldtype: "Link", options: "State" },
// 			{ label: "Zone", fieldname: "zone", fieldtype: "Link", options: "Zone" },
// 			{ label: "Estimated Cost", fieldname: "estimated_cost", fieldtype: "Int" },
// 			{ label: "Zone Name", fieldname: "zone_name", fieldtype: "Data" },
// 			{ label: "Remarks", fieldname: "remarks", fieldtype: "Small Text" },
// 			{
// 				fieldtype: "Button",
// 				label: "➕ Add Row to Financial Approval Form",
// 				fieldname: "add_row_btn",
// 				click() {
// 					const values = dialog.get_values();
// 					if (!values.zone) {
// 						frappe.msgprint("❗ Please fill all Financial Approval fields.");
// 						return;
// 					}

// 					const new_row = {
// 						distict_name: values.distict_name,
// 						state_name: values.state_name,
// 						zone: values.zone,
// 						estimated_cost: values.estimated_cost,
// 						zone_name: values.zone_name,
// 						remarks: values.remarks
// 					};

// 					if (editing_index !== null) {
// 						boq_rows[editing_index] = new_row;
// 						editing_index = null;
// 						dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to Financial Approval Form";
// 					} else {
// 						boq_rows.push(new_row);
// 					}

// 					update_preview_table();

// 					dialog.set_value("distict_name", "");
// 					dialog.set_value("state_name", "");
// 					dialog.set_value("zone", "");
// 					dialog.set_value("estimated_cost", "");
// 					dialog.set_value("zone_name", "");
// 					dialog.set_value("remarks", "");
// 				}
// 			},
// 			{ fieldtype: "HTML", fieldname: "boq_table_preview" },
// 			{ fieldtype: "Hidden", fieldname: "project", default: frm.doc.name }
// 		],

// 		primary_action_label: "Create Financial Approvals",
// 		primary_action(values) {
// 			if (boq_rows.length === 0) {
// 				frappe.msgprint("Please add at least one item.");
// 				return;
// 			}

// 			let html = `
// 				<div>
// 					<p><b>Ref No.:</b> ${values.refno}</p>
// 					<p><b>Estimate For Construction Work Of Satsang Bhawan At:</b> ${values.satsang_bhavan}</p> 
// 					<p><b>Date:</b> ${values.dates}</p>
// 					<p><b>Total Amount:</b> ${values.total_amount}</p>
// 					<table style="width:100%; border-collapse: collapse; margin-top:10px;" border="1" cellpadding="8" cellspacing="0">
// 						<thead style="background-color: #eaeaea;">
// 						  <tr>
// 							<td><b>District Name</b></td>
// 							<td><b>State Name</b></td>
// 							<td><b>Zone</b></td>
// 							<td><b>Estimated Cost</b></td>
// 							<td><b>Zone Name</b></td>
// 							<td><b>Remarks</b></td>
// 						</tr>
// 						</thead>
// 						<tbody>`;

// 			boq_rows.forEach(row => {
// 				html += `
// 					<tr>
// 						<td>${row.distict_name}</td>
// 						<td>${row.state_name}</td>
// 						<td>${row.zone}</td>
// 						<td>${row.estimated_cost}</td>
// 						<td>${row.zone_name || ""}</td>
// 						<td>${row.remarks}</td>
// 					</tr>`;
// 			});

// 			html += `</tbody></table></div>`;

// 			const doc_data = {
// 				doctype: "Financial Approval Form",
// 				project: values.project,
// 				refno: values.refno,
// 				satsang_bhavan: values.satsang_bhavan,
// 				dates: values.dates,
// 				total_amount: values.total_amount,
// 				financial_approvals: boq_rows
// 			};

// 			frappe.call({
// 				method: "frappe.client.insert",
// 				args: { doc: doc_data },
// 				callback(r) {
// 					if (!r.exc) {
// 						const docname = r.message.name;

// 						frappe.call({
// 							method: "frappe.client.set_value",
// 							args: {
// 								doctype: "Project",
// 								name: frm.doc.name,
// 								fieldname: "custom_financial_approval_preview",
// 								value: html
// 							},
// 							callback: function () {
// 								frm.reload_doc();
// 							}
// 						});

// 						frappe.call({
// 							method: "frappe.client.set_value",
// 							args: {
// 								doctype: "Project",
// 								name: frm.doc.name,
// 								fieldname: "custom_fin_aproval_id",
// 								value: docname
// 							}
// 						});

// 						dialog.hide();
// 					}
// 				}
// 			});
// 		}
// 	});

// 	dialog.show();

// 	setTimeout(() => {
// 		dialog.$wrapper.css({
// 			"display": "flex",
// 			"align-items": "center",
// 			"justify-content": "center",
// 			"padding": "10px",
// 			"height": "100vh",
// 			"overflow": "hidden"
// 		});

// 		dialog.$wrapper.find('.modal-dialog').css({
// 			"max-width": "900px",
// 			"width": "80%",
// 			"max-height": "80vh",
// 			"margin": "auto"
// 		});

// 		dialog.$wrapper.find('.modal-content').css({
// 			"max-height": "80vh",
// 			"overflow-y": "auto"
// 		});
// 	}, 100);

// 	function update_preview_table() {
// 		let html = `
// 			<table class="table table-bordered" style="margin-top:15px;">
// 				<thead>
// 					<tr>
// 						<th>District</th>
// 						<th>State</th>
// 						<th>Zone</th>
// 						<th>Estimated Cost</th>
// 						<th>Zone Name</th>
// 						<th>Remarks</th>
// 						<th>Actions</th>
// 					</tr>
// 				</thead>
// 				<tbody>`;

// 		boq_rows.forEach((row, index) => {
// 			html += `<tr>
// 				<td>${row.distict_name}</td>
// 				<td>${row.state_name}</td>
// 				<td>${row.zone}</td>
// 				<td>${row.estimated_cost}</td>
// 				<td>${row.zone_name}</td>
// 				<td>${row.remarks}</td>
// 				<td>
// 					<button class="btn btn-sm btn-primary edit-row" data-index="${index}">Edit</button>
// 					<button class="btn btn-sm btn-danger delete-row" data-index="${index}">Delete</button>
// 				</td>
// 			</tr>`;
// 		});

// 		html += `</tbody></table>`;

// 		dialog.fields_dict.boq_table_preview.$wrapper.html(html);

// 		dialog.fields_dict.boq_table_preview.$wrapper.find(".edit-row").on("click", function () {
// 			editing_index = parseInt($(this).data("index"));
// 			const row = boq_rows[editing_index];
// 			dialog.set_value("distict_name", row.distict_name);
// 			dialog.set_value("state_name", row.state_name);
// 			dialog.set_value("zone", row.zone);
// 			dialog.set_value("estimated_cost", row.estimated_cost);
// 			dialog.set_value("zone_name", row.zone_name);
// 			dialog.set_value("remarks", row.remarks);
// 			dialog.fields_dict.add_row_btn.input.innerText = "🔄 Update Row";
// 		});

// 		dialog.fields_dict.boq_table_preview.$wrapper.find(".delete-row").on("click", function () {
// 			const idx = parseInt($(this).data("index"));
// 			boq_rows.splice(idx, 1);
// 			editing_index = null;
// 			dialog.fields_dict.add_row_btn.input.innerText = "➕ Add Row to Financial Approval Form";
// 			dialog.set_value("distict_name", "");
// 			dialog.set_value("state_name", "");
// 			dialog.set_value("zone", "");
// 			dialog.set_value("estimated_cost", "");
// 			dialog.set_value("zone_name", "");
// 			dialog.set_value("remarks", "");
// 			update_preview_table();
// 		});
// 	}
// }

// function fix_text_editor_style(frm) {
// 	if (!frm.fields_dict.custom_financial_approval_preview) return;

// 	const wrapper = frm.fields_dict.custom_financial_approval_preview.$wrapper;
// 	wrapper.find('.ql-toolbar').hide();

// 	const editor = wrapper.find('.ql-container');
// 	editor.css({
// 		'pointer-events': 'none',
// 		'background-color': 'transparent',
// 		'border': '1px solid #ccc',
// 		'box-shadow': 'none',
// 		'max-height': '800px',
// 		'height': 'auto',
// 		'overflow-y': 'auto',
// 		'overflow-x': 'hidden',
// 		'width': '100%',
// 		'resize': 'vertical',
// 		'min-height': '300px'
// 	});

// 	wrapper.find('.ql-editor').css({
// 		'height': 'auto',
// 		'min-height': '300px',
// 		'max-height': '600px',
// 		'overflow': 'visible'
// 	});
// }

//Construction committe Form
// frappe.ui.form.on('Project', {
//     custom_construction_committees: function (frm) {
//         let boq_rows = [];

//         const dialog = new frappe.ui.Dialog({
//             title: 'Construction Committee Form',
//             size: 'extra-large',
//             fields: [
//                 { label: "Branch", fieldname: "branch", fieldtype: "Link", options: "Branch", reqd: 1 },
//                 { label: "Zone", fieldname: "zone_no", fieldtype: "Link", options: "Zone", reqd: 1 },
//                 { label: "Date", fieldname: "date", fieldtype: "Date", reqd: 1 },

//                 { fieldtype: "Section Break", label: "Committee Member Entry" },
//                 { label: "Name", fieldname: "name1", fieldtype: "Data" },
//                 { label: "Father Name", fieldname: "fathers_name", fieldtype: "Data" },
//                 { label: "Age", fieldname: "age", fieldtype: "Int" },
//                 { label: "Education", fieldname: "education", fieldtype: "Data" },
//                 { label: "Occupation", fieldname: "occupation", fieldtype: "Data" },
//                 { label: "Address", fieldname: "address", fieldtype: "Small Text" },
//                 { label: "Signature", fieldname: "signature", fieldtype: "Signature" },
//                 { fieldtype: "Column Break" },
//                 {
//                     fieldtype: "Button",
//                     label: "Add Row",
//                     click() {
//                         const values = dialog.get_values();
//                         if (!(values.name1 && values.fathers_name)) {
//                             frappe.msgprint("Please enter at least Name and Father's Name.");
//                             return;
//                         }

//                         const signature_canvas = dialog.fields_dict.signature.$wrapper.find("canvas")[0];
//                         const signature_data = signature_canvas ? signature_canvas.toDataURL("image/png") : "";

//                         boq_rows.push({
//                             name1: values.name1,
//                             fathers_name: values.fathers_name,
//                             age: values.age,
//                             education: values.education,
//                             occupation: values.occupation,
//                             address: values.address,
//                             signature: signature_data
//                         });

//                         update_html_table();
//                         ["name1", "fathers_name", "age", "education", "occupation", "address", "signature"].forEach(f => {
//                             dialog.set_value(f, "");
//                         });
//                     }
//                 },

//                 { fieldtype: "Section Break", label: "Bank & Verification" },
//                 { label: "Image", fieldname: "image", fieldtype: "Attach" },
//                 { label: "Branch Bank Account Name", fieldname: "branch_bank_account_name", fieldtype: "Data" },
//                 { label: "Branch Bank Account No", fieldname: "branch_bank_account_no", fieldtype: "Data" },
//                 { label: "Engineer/Architect Name", fieldname: "civil_engineerdraftsmanarchitect_name", fieldtype: "Data" },
//                 { label: "Engineer/Architect No", fieldname: "civil_engineerdraftsmanarchitect_no", fieldtype: "Data" },
//                 { label: "Verified by Zonal Incharge", fieldname: "verified_by_zonal_incharge", fieldtype: "Signature" },
//                 { label: "Mukhisanyojak", fieldname: "mukhisanyojak", fieldtype: "Signature" }
//             ],
//             primary_action_label: "Save",
//             primary_action(values) {
//                 const zonal_signature_canvas = dialog.fields_dict.verified_by_zonal_incharge.$wrapper.find("canvas")[0];
//                 const mukhisanyojak_signature_canvas = dialog.fields_dict.mukhisanyojak.$wrapper.find("canvas")[0];

//                 const zonal_signature_data = zonal_signature_canvas ? zonal_signature_canvas.toDataURL("image/png") : "";
//                 const mukhisanyojak_signature_data = mukhisanyojak_signature_canvas ? mukhisanyojak_signature_canvas.toDataURL("image/png") : "";

//                 update_html_table(zonal_signature_data, mukhisanyojak_signature_data);
//                 dialog.hide();
//                 frappe.call({
//                     method: "frappe.client.insert",
//                     args: {
//                         doc: {
//                             doctype: "Construction Committee Form",
//                             project: frm.doc.name,
//                             branch: values.branch,
//                             zone_no: values.zone_no,
//                             date: values.date,
//                             image: values.image,
//                             branch_bank_account_name: values.branch_bank_account_name,
//                             branch_bank_account_no: values.branch_bank_account_no,
//                             civil_engineerdraftsmanarchitect_name: values.civil_engineerdraftsmanarchitect_name,
//                             civil_engineerdraftsmanarchitect_no: values.civil_engineerdraftsmanarchitect_no,
//                             verified_by_zonal_incharge: zonal_signature_data,
//                             mukhisanyojak: mukhisanyojak_signature_data,
//                             name_of_the_committee_members: boq_rows.map(r => ({
//                                 ...r,
//                                 parentfield: "name_of_the_committee_members"
//                             }))
//                         }
//                     },
//                     callback(res) {
//                         if (!res.exc) {
//                             frappe.msgprint("Construction Committee Form successfully created.");
//                         }
//                     }
//                 });
//             }
//         });

//         function update_html_table(zonal_sig = "", mukhisig = "") {
//             let html = `
//                 <table class="table table-bordered" style="margin-top:20px;">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Father's Name</th>
//                             <th>Age</th>
//                             <th>Education</th>
//                             <th>Occupation</th>
//                             <th>Address</th>
//                             <th>Signature</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>`;

//             boq_rows.forEach((r, index) => {
//                 html += `
//                     <tr>
//                         <td>${r.name1}</td>
//                         <td>${r.fathers_name}</td>
//                         <td>${r.age || ""}</td>
//                         <td>${r.education || ""}</td>
//                         <td>${r.occupation || ""}</td>
//                         <td>${r.address || ""}</td>
//                         <td><img src="${r.signature}" width="100"/></td>
//                         <td>
//                             <button class="btn btn-xs btn-danger" onclick="deleteRow(${index})">Delete</button>
//                         </td>
//                     </tr>`;
//             });

//             html += `</tbody></table>`;

//             if (zonal_sig || mukhisig) {
//                 html += `<div style="margin-top:20px;">
//                     <strong>Verified by Zonal Incharge:</strong><br/>
//                     ${zonal_sig ? `<img src="${zonal_sig}" width="150"/>` : "N/A"}
//                     <br/><br/>
//                     <strong>Mukhisanyojak:</strong><br/>
//                     ${mukhisig ? `<img src="${mukhisig}" width="150"/>` : "N/A"}
//                 </div>`;
//             }

//             frm.set_value("custom_construction_committee_forms", html);
//             frm.refresh_field("custom_construction_committee_forms");
//         }
//         window.deleteRow = (index) => {
//             boq_rows.splice(index, 1);
//             update_html_table();
//         };

//         dialog.show();
//     }
// });
// frappe.ui.form.on('Project', {
//     	custom_add_sadh_sangat_info(frm) {
//         const dialog = new frappe.ui.Dialog({
//             title: 'Create Profsorma For Sadh Sangat',
//             size: 'extra-large',
//             fields: [
//                 { label: 'Branch', fieldname: 'branch', fieldtype: 'Link', options: 'Branch' },
//                 { label: 'Zone', fieldname: 'zone_no', fieldtype: 'Link', options: 'Zone' },
//                 { label: 'District', fieldname: 'district', fieldtype: 'Link', options: 'District' },
//                 { label: 'State', fieldname: 'state', fieldtype: 'Link', options: 'State' },
//                 { label: 'Branch Code', fieldname: 'branch_code', fieldtype: 'Data' },
//                 { label: 'Date', fieldname: 'date', fieldtype: 'Date' ,default:frappe.datetime.get_today()},
//                 { label: 'Tehsil', fieldname: 'tehsil', fieldtype: 'Link',options:"Tehsil" },
//                 { fieldtype: 'Section Break', label: 'General Details' },
//                 { label: 'In Which Year Sadh Sangat Started There', fieldname: 'in_which_year_sadh_sangat_started_there', fieldtype: 'Date' },
//                 { label: 'Whether Branch is Registered', fieldname: 'whether_branch_is_registered_if_so_since_when', fieldtype: 'Check' },
// 				{label:'Registration Year',fieldname:'registration_year',depends_on:'eval:doc.whether_branch_is_registered_if_so_since_when',fieldtype: 'Int'},
//                 { label: 'Distance in KM to the Nearest Bhawan', fieldname: 'distance_in_km_to_the_nearest_bhawan_from_your_branch', fieldtype: 'Data' },
//                 { label: 'Nearest Branch with Distance', fieldname: 'nearest_branch_with_distance', fieldtype: 'Data' },
//                 { label: 'Strength of Sadh Sangat', fieldname: 'strength_of_sadh_sangat_from_urban_area_and_rural_area', fieldtype: 'Small Text' },

//                 { fieldtype: 'Section Break', label: 'Details of Sangat' },
//                 {
//                     fieldname: 'details_of_sangat',
//                     label: 'Details of Sangat',
//                     fieldtype: 'Table',
//                     cannot_add_rows: false,
//                     options: 'Details of Sangat',
//                     fields: [
//                         { fieldname: 'normal_sangat', label: 'Normal Sangat', fieldtype: 'Int' },
//                         { fieldname: 'special_sangat', label: 'Special Sangat', fieldtype: 'Int' },
//                         { fieldname: 'ladies_sangat', label: 'Ladies Sangat', fieldtype: 'Int' },
//                         { fieldname: 'bal_sangat', label: 'Bal Sangat', fieldtype: 'Int' },
//                         { fieldname: 'english_sangat', label: 'English Sangat', fieldtype: 'Int' },
//                         { fieldname: 'average_monthly', label: 'Average Monthly', fieldtype: 'Int' },
//                         { fieldname: 'monthly_building', label: 'Monthly Building', fieldtype: 'Int' }
//                     ]
//                 },
//                 {
//                     fieldname: 'blood_donation',
//                     label: 'Blood Donation Record',
//                     fieldtype: 'Table',
//                     cannot_add_rows: false,
//                     options: 'Blood Donation Record',
//                     fields: [
//                         { fieldname: 'year', label: 'Normal Sangat', fieldtype: 'Int' },
//                         { fieldname: 'units_donated', label: 'Special Sangat', fieldtype: 'Data' }
//                     ]
//                 },
//                 { fieldtype: 'Section Break', label: 'Details of Sewadal' },
//                 {
//                     fieldname: 'details_of_sewadal',
//                     label: 'Details of Sewadal',
//                     fieldtype: 'Table',
//                     cannot_add_rows: false,
//                     options: 'Details of Sewadal',
//                     fields: [
//                         { fieldname: 'unit_no_of_sewadal', label: 'Unit No. of Sewadal', fieldtype: 'Data' },
//                         { fieldname: 'strength_of_sewadal', label: 'Strength of Sewadal', fieldtype: 'Int' },
//                         { fieldname: 'no_of_males', label: 'No. of Males', fieldtype: 'Int' },
//                         { fieldname: 'no_of_females', label: 'No. of Females', fieldtype: 'Int' },
//                         { fieldname: 'no_of_bal_sewadal', label: 'No. of Bal Sewadal', fieldtype: 'Int' }
//                     ]
//                 },

//                 { fieldtype: 'Section Break', label: 'Recommendation of Members' },
//                 {
//                     fieldname: 'recommendation_of_members',
//                     label: 'Recommendation of Members',
//                     fieldtype: 'Table',
//                     cannot_add_rows: false,
//                     options: 'Recommendation of Members',
//                     fields: [
//                         { fieldname: 'designation', label: 'Designation', fieldtype: 'Data' },
//                         { fieldname: 'name1', label: 'Name', fieldtype: 'Data' },
//                         { fieldname: 'address', label: 'Address', fieldtype: 'Data' },
//                         { fieldname: 'pin_code', label: 'PIN Code', fieldtype: 'Data' },
//                         { fieldname: 'mob_no', label: 'Mobile No.', fieldtype: 'Data' },
//                         { fieldname: 'email', label: 'Email', fieldtype: 'Data' },
//                         { fieldname: 'signature', label: 'Signature', fieldtype: 'Signature' },
//                         { fieldname: 'photo', label: 'Photo', fieldtype: 'Attach' }
//                     ]
//                 }
//             ],

//             primary_action_label: 'Save',
//             primary_action(values) {
//                 const doc = {
//                     doctype: 'Proforma For Sadh Sangat',
//                     ...values,
//                     details_of_sangat: (values.details_of_sangat || []).map(row => ({ ...row, doctype: 'Details of Sangat' })),
//                     blood_donation: (values.blood_donation || []).map(row => ({ ...row, doctype: 'Blood Donation Record' })),
//                     details_of_sewadal: (values.details_of_sewadal || []).map(row => ({ ...row, doctype: 'Details of Sewadal' })),
//                     recommendation_of_members: (values.recommendation_of_members || []).map(row => ({ ...row, doctype: 'Recommendation of Members' }))
//                 };

//                 frappe.call({
//                     method: 'frappe.client.insert',
//                     args: { doc },
//                     callback: function (r) {
//                         if (!r.exc) {
//                             frappe.msgprint(__('Proforma record created successfully'));
//                     frm.set_value("custom_sadh_sangat_previewss", `
//                         <style>
//                             .sadh-preview-table {
//                                 width: 100%;
//                                 border-collapse: collapse;
//                                 margin-bottom: 20px;
//                             }
//                             .sadh-preview-table th, .sadh-preview-table td {
//                                 border: 1px solid #999;
//                                 padding: 8px;
//                             }
//                             .sadh-preview-table th {
//                                 background-color: #f2f2f2;
//                             }
//                             .sadh-preview-section-title {
//                                 font-size: 16px;
//                                 font-weight: bold;
//                                 background: #efefef;
//                                 padding: 6px;
//                                 margin-top: 20px;
//                             }
//                         </style>

//                         <div class="sadh-preview">
//                             <div class="sadh-preview-section-title">Sadh Sangat Summary</div>
//                             <table class="sadh-preview-table">
//                                 <tr><td><b>Branch</b></td><td>${values.branch || ""}</td></tr>
//                                 <tr><td><b>Zone</b></td><td>${values.zone_no || ""}</td></tr>
//                                 <tr><td><b>District</b></td><td>${values.district || ""}</td></tr>
//                                 <tr><td><b>State</b></td><td>${values.state || ""}</td></tr>
//                                 <tr><td><b>Branch Code</b></td><td>${values.branch_code || ""}</td></tr>
//                                 <tr><td><b>Date</b></td><td>${frappe.datetime.str_to_user(values.date)}</td></tr>
//                                 <tr><td><b>Tehsil</b></td><td>${values.tehsil || ""}</td></tr>
//                                 <tr><td><b>Branch Registered?</b></td><td>${values.whether_branch_is_registered_if_so_since_when ? "Yes" : "No"}</td></tr>
//                                 <tr><td><b>Distance to Nearest Bhawan</b></td><td>${values.distance_in_km_to_the_nearest_bhawan_from_your_branch || ""}</td></tr>
//                                 <tr><td><b>Nearest Branch</b></td><td>${values.nearest_branch_with_distance || ""}</td></tr>
//                                 <tr><td><b>Strength of Sadh Sangat</b></td><td>${values.strength_of_sadh_sangat_from_urban_area_and_rural_area || ""}</td></tr>
//                             </table>

//                             <div class="sadh-preview-section-title">Details of Sangat</div>
//                             <table class="sadh-preview-table">
//                                 <tr><td><b>Normal</b></td><td><b>Special</b></td><td><b>Ladies</b></td><td><b>Bal</b></td><td><b>English</b></td><td><b>Avg Monthly</b></td><th><b>Monthly Building</b></td></tr>
//                                 ${(values.details_of_sangat || []).map(row => `
//                                     <tr>
//                                         <td>${row.normal_sangat || 0}</td>
//                                         <td>${row.special_sangat || 0}</td>
//                                         <td>${row.ladies_sangat || 0}</td>
//                                         <td>${row.bal_sangat || 0}</td>
//                                         <td>${row.english_sangat || 0}</td>
//                                         <td>${row.average_monthly || 0}</td>
//                                         <td>${row.monthly_building || 0}</td>
//                                     </tr>
//                                 `).join("")}
//                             </table>

//                             <div class="sadh-preview-section-title">Blood Donation Record</div>
//                             <table class="sadh-preview-table">
//                                 <tr><td><b>Year</b></td><td><b>Units Donated</b></td></tr>
//                                 ${(values.blood_donation || []).map(row => `
//                                     <tr>
//                                         <td>${row.year || ""}</td>
//                                         <td>${row.units_donated || ""}</td>
//                                     </tr>
//                                 `).join("")}
//                             </table>

//                             <div class="sadh-preview-section-title">Details of Sewadal</div>
//                             <table class="sadh-preview-table">
//                                 <tr><td><b>Unit No.</b></td><td><b>Strength</b></td><td><b>Males</b></td><td><b>Females</b></td><td><b>Bal Sewadal</b></td></tr>
//                                 ${(values.details_of_sewadal || []).map(row => `
//                                     <tr>
//                                         <td>${row.unit_no_of_sewadal || ""}</td>
//                                         <td>${row.strength_of_sewadal || 0}</td>
//                                         <td>${row.no_of_males || 0}</td>
//                                         <td>${row.no_of_females || 0}</td>
//                                         <td>${row.no_of_bal_sewadal || 0}</td>
//                                     </tr>
//                                 `).join("")}
//                             </table>

//                             <div class="sadh-preview-section-title">Recommendation of Members</div>
//                             <table class="sadh-preview-table">
//                                 <tr>
//                                     <td><b>Designation</b></td><td><b>Name</b></td><td><b>Address</b></td><td><b>PIN</b></td>
//                                     <td><b>Mobile</b></td><td><b>Email</b></td><td><b>Signature</b></td><td>Photo</td>
//                                 </tr>
//                                 ${(values.recommendation_of_members || []).map(row => `
//                                     <tr>
//                                         <td>${row.designation || ""}</td>
//                                         <td>${row.name1 || ""}</td>
//                                         <td>${row.address || ""}</td>
//                                         <td>${row.pin_code || ""}</td>
//                                         <td>${row.mob_no || ""}</td>
//                                         <td>${row.email || ""}</td>
//                                         <td>${row.signature ? `<img src="${row.signature}" width="80"/>` : "—"}</td>
//                                         <td>${row.photo ? `<img src="${row.photo}" width="80"/>` : "—"}</td>
//                                     </tr>
//                                 `).join("")}
//                             </table>
//                         </div>
//                     `);

//                             dialog.hide();
//                             frm.refresh_field("custom_sadh_sangat_previewss");
//                         }
//                     }
//                 });
//             }
//         });

//         dialog.show();
//     }
// });
// function fix_text_editor_style(frm) {
//     if (!frm.fields_dict.custom_sadh_sangat_previewss) return;
//     const wrapper = frm.fields_dict.custom_sadh_sangat_previewss.$wrapper;

//     wrapper.find('.ql-toolbar').hide();
//     wrapper.find('.ql-container').css({
//         'pointer-events': 'none',
//         'background-color': 'transparent',
//         'border': '1px solid #ccc',
//         'box-shadow': 'none',
//         'max-height': '800px',
//         'height': 'auto',
//         'overflow-y': 'auto',
//         'overflow-x': 'hidden',
//         'width': '100%',
//         'resize': 'vertical',
//         'min-height': '1000px'
//     });

//     wrapper.find('.ql-editor').css({
//         'height': 'auto',
//         'min-height': '1000px',
//         'max-height': '1000px',
//         'overflow': 'visible'
//     });
// }


// frappe.ui.form.on('Project', {
//     refresh(frm) {
//         // Mapping of workflow_state to allowed role
//         let role_access = {
//             "Project Request": "Member Incharge (PP)",
//             "Land Clearance": "Building Department",
//             "Planning & Designing": "Building Department",
//             "Drawing Approval": "Building Department",
//             "Member Incharge (Financial Approval)": "Member Incharge (PP)",
//             "Secretary (Financial Approval)": "Secretary HQ",
//             "Member Incharge A&F": "Member Incharge (A&F)",
//             "Financial Approval": "Building Department",
//             "Construction Committee Formed": "Member Incharge (PP)",
//             "Start of Sub Process for Fund Transfer": "Building Department",
//             "100% Fund Transfer": "Member Incharge (PP)",
//             "Work completion Certificate": "Member Incharge (PP)",
//         };

//         let current_state = frm.doc.workflow_state;
//         let allowed_role = role_access[current_state];

//         // If current user doesn't have the allowed role, make fields read-only
//         let user_has_role = frappe.user_roles.includes(allowed_role);

//         if (!user_has_role) {
//             // Make all fields read-only except system fields (like name, owner)
//             frm.fields.forEach(field => {
//                 if (!["Section Break", "Column Break"].includes(field.df.fieldtype)) {
//                     frm.set_df_property(field.df.fieldname, 'read_only', 1);
//                 }
//             });
//         } else {
//             // If user has role for current stage, ensure fields are editable
//             frm.fields.forEach(field => {
//                 if (!["Section Break", "Column Break"].includes(field.df.fieldtype)) {
//                     frm.set_df_property(field.df.fieldname, 'read_only', 0);
//                 }
//             });
//         }
//     }
// });
frappe.ui.form.on('Project', {
    onload(frm) {
        frm.no_timeline = true;
    },
    refresh(frm) {
        const admin = frappe.user.has_role('System Manager');
        if (!admin) {
            if (frm.timeline && frm.timeline.wrapper) {
                frm.timeline.wrapper.hide();
            }
            if (frm.fields_dict.__connections__) {
                frm.fields_dict.__connections__.wrapper.hide();
            }
            $('.form-sidebar .sidebar-label:contains("Connections")').hide();
            $('.form-sidebar .sidebar-item:contains("Connections")').hide();
        }
    }
});
frappe.ui.form.on('Project', {
	refresh: function(frm) {
		frappe.after_ajax(() => {
			setTimeout(() => {
				if (frm.page.sidebar) {
					const sidebar = frm.page.sidebar;
					
					sidebar.find('.sidebar-menu a:contains("See on Website")').hide();
					sidebar.find('.form-stats-likes').hide();
					sidebar.find('.comment-icon').hide();
					sidebar.find('.ml-2').hide();
					sidebar.find('.modified-by').hide();
					sidebar.find('.mx-2').hide();
					sidebar.find('.created-by').hide();
					sidebar.find('.comments').hide();
					sidebar.find('.form-tags').hide();
					sidebar.find('.form-shared').hide();
					sidebar.find('.form-follow').hide();
					frm.page.wrapper.find(".comment-box").css({'display':'none'});
					$(".form-assignments").hide()
					frm.page.wrapper.find('.scroll-to-top btn btn-default icon-btn').css({'display':'none'})
					frm.page.wrapper.find('button.btn.btn-primary:visible').first().css({'display':'none'});
				}   

			}, 0); 
		});
	}
});



frappe.ui.form.on('Project',{
	refresh:function(frm){
		if (!frm.is_new()) {
			rj_btn=frm.add_custom_button(__("Reject"), function () {
			});
			apr_btn=frm.add_custom_button(__("Approve"), function () {
				if (frm.doc.workflow_state === "Draft") {
                    frm.set_value('workflow_state', 'Sent For Recommendation');
                    frm.save();
                } 
				else if (frm.doc.workflow_state === "Sent For Recommendation") {
                    frm.set_value('workflow_state', 'Approved Recommendation');
                    frm.save();
                } 
			});
			r_review_btn=frm.add_custom_button(__("Request For Review"), function () {
			
			});
			}
		rj_btn.css({
				'background-color':'Red',
				'color':'White  ',
				'font-weight': 'bold'
				});
						apr_btn.css({
				'background-color':'Green',
				'color':'White  ',
				'font-weight': 'bold'
				});
						r_review_btn.css({
				'background-color':'DarkBlue',
				'color':'White  ',
				'font-weight': 'bold'
				});
 
			}
})



// frappe.ui.form.on('Project', {
//     validate: function(frm) {
//         (frm.doc.custom_disbursement_detail || []).forEach(row => {
//             if ((row.approved_amount || 0) > (row.requested_amount || 0)) {
//                 frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
//             }
//         });

//         // Calculate total disbursement amount
//         let total_disbursement = 0;
//         (frm.doc.custom_disbursement_detail || []).forEach(row => {
//             total_disbursement += row.approved_amount || 0;
//         });

//         frm.set_value("custom_disbursement_amount", total_disbursement);

//         let total_allocated = frm.doc.custom_total_allocated_amount || 0;
//         let additional_required = frm.doc.custom_additional_require_amount || 0;

//         let remaining = total_allocated - total_disbursement - additional_required;
//         frm.set_value("custom_remaining_amount", remaining);
//     }
// });


// frappe.ui.form.on('Project', {
//     onload: function (frm) {
//         setup_disbursement_events(frm);
//     },
//     refresh: function (frm) {
//         setup_disbursement_events(frm);
//     },
//     validate: function (frm) {
//         calculate_disbursement_and_remaining(frm, true);
//     }
// });

// function setup_disbursement_events(frm) {
//     if (!frm.custom_disbursement_events_setup) {
//         frm.fields_dict.custom_disbursement_detail.grid.wrapper.on('change', function () {
//             calculate_disbursement_and_remaining(frm, false);
//         });

//         // Prevent adding rows if total allocated amount is not filled
//         frm.fields_dict.custom_disbursement_detail.grid.add_btn.on('click', function (e) {
//             if (!frm.doc.custom_total_allocated_amount) {
//                 frappe.throw("Please enter 'Total Allocated Amount' before adding disbursement details.");
//             }
//         });

//         frm.custom_disbursement_events_setup = true;
//     }
// }

// function calculate_disbursement_and_remaining(frm, validate_rows) {
//     let total_approved = 0;
//     let total_allocated = frm.doc.custom_total_allocated_amount || 0;
//     let additional_required = frm.doc.custom_additional_require_amount || 0;

//     (frm.doc.custom_disbursement_detail || []).forEach(row => {
//         let approved = row.approved_amount || 0;
//         let requested = row.requested_amount || 0;

//         if (validate_rows && approved > requested) {
//             frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
//         } else if (!validate_rows && approved > requested) {
//             frappe.msgprint(`Row ${row.idx}: Approved Amount > Requested Amount. Resetting to 0.`);
//             row.approved_amount = 0;
//         }

//         total_approved += row.approved_amount || 0;
//     });

//     // Check approved amount does not exceed allocated
//     if (validate_rows && total_approved > total_allocated) {
//         frappe.throw(`Total Approved Amount (${total_approved}) cannot be more than Total Allocated Amount (${total_allocated}).`);
//     }

//     frm.set_value("custom_disbursement_amount", total_approved);

//     let remaining = total_allocated - total_approved - additional_required;
//     frm.set_value("custom_remaining_amount", remaining);
// }



	// frappe.ui.form.on('Project', {
	//     onload: function (frm) {
	//         setup_disbursement_events(frm);
	//     },
	//     refresh: function (frm) {
	//         setup_disbursement_events(frm);
	//     },
	//     validate: function (frm) {
	//         calculate_disbursement_and_remaining(frm, true);
	//     },
	//     custom_total_allocated_amount: function (frm) {
	//         // Whenever total allocated amount is changed, recalculate
	//         calculate_disbursement_and_remaining(frm, false);
	//     },
	//     custom_additional_require_amount: function (frm) {
	//         // Whenever additional required amount is changed, recalculate
	//         calculate_disbursement_and_remaining(frm, false);
	//     }
	// });

	// function setup_disbursement_events(frm) {
	//     if (!frm.custom_disbursement_events_setup) {
	//         frm.fields_dict.custom_disbursement_detail.grid.wrapper.on('change', function () {
	//             calculate_disbursement_and_remaining(frm, false);
	//         });
	//         frm.custom_disbursement_events_setup = true;
	//     }

	//     frm.fields_dict.custom_disbursement_detail.grid.get_field("approved_amount").onchange = function () {
	//         calculate_disbursement_and_remaining(frm, false);
	//     };
	// }

	// function calculate_disbursement_and_remaining(frm, validate_rows) {
	//     let total_approved = 0;

	//     // Must enter total allocated amount first
	//     let total_allocated = frm.doc.custom_total_allocated_amount || 0;
	//     if (!total_allocated) {
	//         frappe.msgprint("Please enter Total Allocated Amount before adding Disbursement Details.");
	//         return;
	//     }

	//     (frm.doc.custom_disbursement_detail || []).forEach(row => {
	//         let approved = row.approved_amount || 0;
	//         let requested = row.requested_amount || 0;

	//         // Row-wise validation
	//         if (validate_rows && approved > requested) {
	//             frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
	//         } else if (!validate_rows && approved > requested) {
	//             frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting to 0.`);
	//             row.approved_amount = 0;
	//         }

	//         total_approved += row.approved_amount || 0;
	//     });

	//     // Set total disbursement amount
	//     frm.set_value("custom_disbursement_amount", total_approved);

	//     let additional_required = frm.doc.custom_additional_require_amount || 0;

	//     // Check that (approved + additional) doesn't exceed total allocated
	//     if ((total_approved + additional_required) > total_allocated) {
	//         if (validate_rows) {
	//             frappe.throw(`Total (Approved + Additional Required) exceeds Total Allocated Amount.`);
	//         } else {
	//             frappe.msgprint(`(Approved + Additional) exceeds Allocated. Please correct.`);
	//         }
	//     }

	//     // Calculate remaining
	//     let remaining = total_allocated - (total_approved + additional_required);
	//     frm.set_value("custom_remaining_amount", remaining);
	// }


//     frappe.ui.form.on('Project', {
//     onload: function (frm) {
//         setup_disbursement_events(frm);
//     },
//     refresh: function (frm) {
//         setup_disbursement_events(frm);
//     },
//     validate: function (frm) {
//         calculate_disbursement_and_remaining(frm, true);
//     },
//     custom_total_allocated_amount: function (frm) {
//         calculate_disbursement_and_remaining(frm, false);
//     },
//     custom_additional_require_amount: function (frm) {
//         calculate_disbursement_and_remaining(frm, false);
//     }
// });

// function setup_disbursement_events(frm) {
//     if (!frm.custom_disbursement_events_setup) {
//         frm.fields_dict.custom_disbursement_detail.grid.wrapper.on('change', function () {
//             calculate_disbursement_and_remaining(frm, false);
//         });
//         frm.custom_disbursement_events_setup = true;
//     }

//     frm.fields_dict.custom_disbursement_detail.grid.get_field("approved_amount").onchange = function () {
//         calculate_disbursement_and_remaining(frm, false);
//     };
// }

// function calculate_disbursement_and_remaining(frm, validate_rows) {
//     let total_approved = 0;

//     let total_allocated = frm.doc.custom_total_allocated_amount || 0;
//     if (!total_allocated) {
//         frappe.msgprint("Please enter Total Allocated Amount before adding Disbursement Details.");
//         return;
//     }

//     (frm.doc.custom_disbursement_detail || []).forEach(row => {
//         let approved = row.approved_amount || 0;
//         let requested = row.requested_amount || 0;

//         if (validate_rows && approved > requested) {
//             frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
//         } else if (!validate_rows && approved > requested) {
//             frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting to 0.`);
//             row.approved_amount = 0;
//         }

//         total_approved += row.approved_amount || 0;
//     });

//     frm.set_value("custom_disbursement_amount", total_approved);

//     let additional_required = frm.doc.custom_additional_require_amount || 0;

//     // 🔴 Do NOT add here: just subtract later.
//     if ((total_approved) > total_allocated) {
//         if (validate_rows) {
//             frappe.throw(`Total Approved Amount exceeds Total Allocated Amount.`);
//         } else {
//             frappe.msgprint(`Approved exceeds Allocated. Please correct.`);
//         }
//     }

//     // ✅ Correct Remaining Calculation:
//     let remaining = total_allocated - total_approved - additional_required;

//     if (remaining < 0) {
//         if (validate_rows) {
//             frappe.throw("Remaining amount cannot be negative. Check Approved and Additional Required Amount.");
//         } else {
//             frappe.msgprint("Remaining amount negative. Please correct values.");
//         }
//     }

//     frm.set_value("custom_remaining_amount", remaining);
// }



// frappe.ui.form.on('Project', {
// 	onload: function (frm) {
// 		setup_disbursement_events(frm);
// 	},
// 	refresh: function (frm) {
// 		setup_disbursement_events(frm);
// 	},
// 	validate: function (frm) {
// 		calculate_disbursement_and_remaining(frm, true);
// 	},
// 	custom_total_allocated_amount: function (frm) {
// 		calculate_disbursement_and_remaining(frm, false);
// 	},
// 	custom_additional_require_amount: function (frm) {
// 		calculate_disbursement_and_remaining(frm, false);
// 	}
// });

// function setup_disbursement_events(frm) {
// 	if (!frm.custom_disbursement_events_setup) {
// 		frm.fields_dict.custom_disbursement_detail.grid.wrapper.on('change', function () {
// 			calculate_disbursement_and_remaining(frm, false);
// 		});
// 		frm.custom_disbursement_events_setup = true;
// 	}

// 	frm.fields_dict.custom_disbursement_detail.grid.get_field("approved_amount").onchange = function () {
// 		calculate_disbursement_and_remaining(frm, false);
// 	};
// }

// function calculate_disbursement_and_remaining(frm, validate_rows) {
// 	let total_allocated = frm.doc.custom_total_allocated_amount || 0;
// 	let additional_required = frm.doc.custom_additional_require_amount || 0;
// 	let total_approved = 0;

// 	if (!total_allocated) {
// 		frappe.msgprint("Please enter Total Allocated Amount before adding Disbursement Details.");
// 		return;
// 	}
// 	(frm.doc.custom_disbursement_detail || []).forEach(row => {
// 		let approved = row.approved_amount || 0;
// 		let requested = row.requested_amount || 0;

// 		if (validate_rows && approved > requested) {
// 			frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
// 		} else if (!validate_rows && approved > requested) {
// 			frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting to 0.`);
// 			row.approved_amount = 0;
// 		}

// 		total_approved += row.approved_amount || 0;
// 	});

// 	frm.set_value("custom_disbursement_amount", total_approved);
// 	if ((total_approved + additional_required) > total_allocated) {
// 		if (validate_rows) {
// 			frappe.throw("Total of Disbursement + Additional Required exceeds Total Allocated Amount.");
// 		} else {
// 			frappe.msgprint("Disbursement + Additional Required exceeds Allocated. Please adjust values.");
// 		}
// 	}
// 	let remaining = total_allocated - total_approved - additional_required;

// 	frm.set_value("custom_remaining_amount", remaining);
// }
















// frappe.ui.form.on('Project', {
// 	onload: function (frm) {
// 		setup_disbursement_events(frm);
// 		setup_additional_request_events(frm);
// 	},

// 	refresh: function (frm) {
// 		setup_disbursement_events(frm);
// 		setup_additional_request_events(frm);

		
// 		calculate_total_allocate_amount(frm);
// 	},

// 	validate: function (frm) {
// 		calculate_additional_required_amount(frm);
// 		calculate_total_allocate_amount(frm);
// 		calculate_disbursement_and_remaining(frm, true);
// 	},

	
// 	custom_total_allocated_amount: function (frm) {
// 		calculate_disbursement_and_remaining(frm, false);
// 	},

	
// 	custom_project_allocated_amount: function (frm) {
// 		calculate_total_allocate_amount(frm);
// 	},


// 	custom_additional_require_amount: function (frm) {
// 		calculate_disbursement_and_remaining(frm, false);
// 		calculate_total_allocate_amount(frm);
// 	}
// });


// function setup_disbursement_events(frm) {
// 	if (!frm.custom_disbursement_events_setup) {
// 		frm.fields_dict.custom_disbursement_detail.grid.wrapper.on('change', function () {
// 			calculate_disbursement_and_remaining(frm, false);
// 		});

// 		frm.fields_dict.custom_disbursement_detail.grid.get_field("approved_amount").onchange = function () {
// 			calculate_disbursement_and_remaining(frm, false);
// 		};

// 		frm.custom_disbursement_events_setup = true;
// 	}
// }


// function setup_additional_request_events(frm) {
// 	if (!frm.custom_additional_events_setup) {
// 		frm.fields_dict.custom_additional_request_details.grid.wrapper.on('change', function () {
// 			calculate_additional_required_amount(frm);
// 			calculate_disbursement_and_remaining(frm, false);
// 		});

// 		frm.fields_dict.custom_additional_request_details.grid.get_field("approved_amount").onchange = function () {
// 			calculate_additional_required_amount(frm);
// 			calculate_disbursement_and_remaining(frm, false);
// 		};

// 		frm.custom_additional_events_setup = true;
// 	}
// }


// function calculate_additional_required_amount(frm) {
// 	let total_additional_required = 0;

// 	(frm.doc.custom_additional_request_details || []).forEach(row => {
// 		total_additional_required += row.approved_amount || 0;
// 	});

// 	frm.set_value("custom_additional_require_amount", total_additional_required);

// 	calculate_total_allocate_amount(frm);
// }


// function calculate_total_allocate_amount(frm) {
// 	let base_amount = frm.doc.custom_project_allocated_amount || 0;
// 	let additional_required = frm.doc.custom_additional_require_amount || 0;
// 	let total_allocate_amount = base_amount + additional_required;

// 	frm.set_value("custom_total_allocated_amount", total_allocate_amount).then(() => {
// 		calculate_disbursement_and_remaining(frm, false);
// 	});
// }


// function calculate_disbursement_and_remaining(frm, validate_rows) {
// 	let total_allocated = frm.doc.custom_total_allocated_amount || 0;
// 	let total_approved = 0;

// 	if (!total_allocated) {
// 		frappe.msgprint("Please enter Total Allocated Amount before adding Disbursement Details.");
// 		return;
// 	}

// 	(frm.doc.custom_disbursement_detail || []).forEach(row => {
// 		let approved = row.approved_amount || 0;
// 		let requested = row.requested_amount || 0;

// 		if (validate_rows && approved > requested) {
// 			frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
// 		} else if (!validate_rows && approved > requested) {
// 			frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting to 0.`);
// 			row.approved_amount = 0;
// 		}

// 		total_approved += row.approved_amount || 0;
// 	});

// 	frm.set_value("custom_disbursement_amount", total_approved);

// 	if (total_approved > total_allocated) {
// 		if (validate_rows) {
// 			frappe.throw("Total Disbursement exceeds Total Allocated Amount.");
// 		} else {
// 			frappe.msgprint("Disbursement exceeds Allocated. Please adjust values.");
// 		}
// 	}

// 	let remaining = total_allocated - total_approved;
// 	frm.set_value("custom_remaining_amount", remaining);
// }



// frappe.ui.form.on('Project', {
// 	onload: function (frm) {
// 		setup_disbursement_events(frm);
// 		setup_additional_request_events(frm);
// 	},

// 	refresh: function (frm) {
// 		setup_disbursement_events(frm);
// 		setup_additional_request_events(frm);

// 		calculate_total_allocate_amount(frm);
// 		update_disbursement_status_from_last_row(frm);
// 	},

// 	validate: function (frm) {
// 		calculate_additional_required_amount(frm);
// 		calculate_total_allocate_amount(frm);
// 		calculate_disbursement_and_remaining(frm, true);
// 		update_disbursement_status_from_last_row(frm);
// 	},

// 	custom_total_allocated_amount: function (frm) {
// 		calculate_disbursement_and_remaining(frm, false);
// 	},

// 	custom_project_allocated_amount: function (frm) {
// 		calculate_total_allocate_amount(frm);
// 	},

// 	custom_additional_require_amount: function (frm) {
// 		calculate_disbursement_and_remaining(frm, false);
// 		calculate_total_allocate_amount(frm);
// 	}
// });


// function setup_disbursement_events(frm) {
// 	if (!frm.custom_disbursement_events_setup) {
// 		frm.fields_dict.custom_disbursement_detail.grid.wrapper.on('change', function () {
// 			calculate_disbursement_and_remaining(frm, false);
// 			update_disbursement_status_from_last_row(frm);
// 		});

// 		frm.fields_dict.custom_disbursement_detail.grid.get_field("approved_amount").onchange = function () {
// 			calculate_disbursement_and_remaining(frm, false);
// 			update_disbursement_status_from_last_row(frm);
// 		};

// 		frm.fields_dict.custom_disbursement_detail.grid.get_field("current_state").onchange = function () {
// 			update_disbursement_status_from_last_row(frm);
// 		};

// 		frm.custom_disbursement_events_setup = true;
// 	}
// }


// function setup_additional_request_events(frm) {
// 	if (!frm.custom_additional_events_setup) {
// 		frm.fields_dict.custom_additional_request_details.grid.wrapper.on('change', function () {
// 			calculate_additional_required_amount(frm);
// 			calculate_disbursement_and_remaining(frm, false);
// 		});

// 		frm.fields_dict.custom_additional_request_details.grid.get_field("approved_amount").onchange = function () {
// 			calculate_additional_required_amount(frm);
// 			calculate_disbursement_and_remaining(frm, false);
// 		};

// 		frm.custom_additional_events_setup = true;
// 	}
// }


// function calculate_additional_required_amount(frm) {
// 	let total_additional_required = 0;

// 	(frm.doc.custom_additional_request_details || []).forEach(row => {
// 		total_additional_required += row.approved_amount || 0;
// 	});

// 	frm.set_value("custom_additional_require_amount", total_additional_required);
// 	calculate_total_allocate_amount(frm);
// }


// function calculate_total_allocate_amount(frm) {
// 	let base_amount = frm.doc.custom_project_allocated_amount || 0;
// 	let additional_required = frm.doc.custom_additional_require_amount || 0;
// 	let total_allocate_amount = base_amount + additional_required;

// 	frm.set_value("custom_total_allocated_amount", total_allocate_amount).then(() => {
// 		calculate_disbursement_and_remaining(frm, false);
// 	});
// }


// function calculate_disbursement_and_remaining(frm, validate_rows) {
// 	let total_allocated = frm.doc.custom_total_allocated_amount || 0;
// 	let total_approved = 0;

// 	if (!total_allocated) {
// 		frappe.msgprint("Please enter Total Allocated Amount before adding Disbursement Details.");
// 		return;
// 	}

// 	(frm.doc.custom_disbursement_detail || []).forEach(row => {
// 		let approved = row.approved_amount || 0;
// 		let requested = row.requested_amount || 0;

// 		if (validate_rows && approved > requested) {
// 			frappe.throw(`Row ${row.idx}: Approved Amount cannot be greater than Requested Amount.`);
// 		} else if (!validate_rows && approved > requested) {
// 			frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting to 0.`);
// 			row.approved_amount = 0;
// 		}

// 		total_approved += row.approved_amount || 0;
// 	});

// 	frm.set_value("custom_disbursement_amount", total_approved);

// 	if (total_approved > total_allocated) {
// 		if (validate_rows) {
// 			frappe.throw("Total Disbursement exceeds Total Allocated Amount.");
// 		} else {
// 			frappe.msgprint("Disbursement exceeds Allocated. Please adjust values.");
// 		}
// 	}

// 	let remaining = total_allocated - total_approved;
// 	frm.set_value("custom_remaining_amount", remaining);
// }


// function update_disbursement_status_from_last_row(frm) {
// 	let disbursements = frm.doc.custom_disbursement_detail || [];
// 	if (disbursements.length > 0) {
// 		let last_row = disbursements[disbursements.length - 1];
// 		let status = last_row.current_state || "";
// 		frm.set_value("custom_disbursement_status", status);
// 	} else {
// 		frm.set_value("custom_disbursement_status", "");
// 	}
// }


frappe.ui.form.on('Project', {
	onload(frm) {
		setup_disbursement_events(frm);
		setup_additional_request_events(frm);
	},

	refresh(frm) {
		setup_disbursement_events(frm);
		setup_additional_request_events(frm);

		calculate_total_allocate_amount(frm);
		update_disbursement_status_from_last_row(frm);
	},

	validate(frm) {
		calculate_additional_required_amount(frm);
		calculate_total_allocate_amount(frm);
		calculate_disbursement_and_remaining(frm, true);
		update_disbursement_status_from_last_row(frm);
	},

	custom_project_allocated_amount(frm) {
		calculate_total_allocate_amount(frm);
	},

	custom_additional_require_amount(frm) {
		calculate_additional_required_amount(frm);
		calculate_total_allocate_amount(frm);
		calculate_disbursement_and_remaining(frm, false);
	},

	custom_suggested_by_member_incharge_a__f(frm) {
		update_project_allocated_from_suggestion(frm);
	}
});


function setup_disbursement_events(frm) {
	if (!frm.custom_disbursement_events_setup) {
		setTimeout(() => {
			const field = frm.fields_dict.custom_disbursement_detail;
			if (field && field.grid && typeof field.grid.on === 'function') {
				field.grid.on('child_change', () => {
					calculate_disbursement_and_remaining(frm, false);
					update_disbursement_status_from_last_row(frm);
					frm.dirty();
				});
				frm.custom_disbursement_events_setup = true;
			}
		}, 300); 
	}
}

function setup_additional_request_events(frm) {
	if (!frm.custom_additional_events_setup) {
		setTimeout(() => {
			const field = frm.fields_dict.custom_additional_request_details;
			if (field && field.grid && typeof field.grid.on === 'function') {
				field.grid.on('child_change', () => {
					calculate_additional_required_amount(frm);
					calculate_disbursement_and_remaining(frm, false);
					frm.dirty();
				});
				frm.custom_additional_events_setup = true;
			}
		}, 300); 
	}
}

function calculate_additional_required_amount(frm) {
	let total = 0;
	(frm.doc.custom_additional_request_details || []).forEach(row => {
		total += flt(row.approved_amount);
	});

	if (frm.doc.custom_additional_require_amount !== total) {
		frm.set_value("custom_additional_require_amount", total).then(() => frm.dirty());
	}
}

function calculate_total_allocate_amount(frm) {
	const base = flt(frm.doc.custom_project_allocated_amount);
	const additional = flt(frm.doc.custom_additional_require_amount);
	const total = base + additional;

	if (frm.doc.custom_total_allocated_amount !== total) {
		frm.set_value("custom_total_allocated_amount", total).then(() => frm.dirty());
	}

	calculate_disbursement_and_remaining(frm, false);
}

function calculate_disbursement_and_remaining(frm, validate_rows) {
	const total_allocated = flt(frm.doc.custom_total_allocated_amount);
	let total_approved = 0;

	for (const row of (frm.doc.custom_disbursement_detail || [])) {
		const approved = flt(row.approved_amount);
		const requested = flt(row.requested_amount);

		if (validate_rows && approved > requested) {
			frappe.throw(`Row ${row.idx}: Approved Amount (${approved}) cannot be greater than Requested Amount (${requested}).`);
		} else if (!validate_rows && approved > requested) {
			frappe.msgprint(`Row ${row.idx}: Approved > Requested. Resetting approved_amount to 0.`);
			row.approved_amount = 0;
		}

		total_approved += row.approved_amount;
	}

	if (frm.doc.custom_disbursement_amount !== total_approved) {
		frm.set_value("custom_disbursement_amount", total_approved).then(() => frm.dirty());
	}

	if (total_approved > total_allocated) {
		const msg = "Total Disbursement exceeds Total Allocated Amount.";
		if (validate_rows) {
			frappe.throw(msg);
		} else {
			frappe.msgprint(msg);
		}
	}

	const remaining = total_allocated - total_approved;

	if (frm.doc.custom_remaining_amount !== remaining) {
		frm.set_value("custom_remaining_amount", remaining).then(() => frm.dirty());
	}
}

function update_disbursement_status_from_last_row(frm) {
	const disbursements = frm.doc.custom_disbursement_detail || [];

	if (disbursements.length > 0) {
		const last_row = disbursements[disbursements.length - 1];
		const status = last_row.current_state || "";

		if (frm.doc.custom_disbursement_status !== status) {
			frm.set_value("custom_disbursement_status", status).then(() => frm.dirty());
		}
	} else {
		if (frm.doc.custom_disbursement_status) {
			frm.set_value("custom_disbursement_status", "").then(() => frm.dirty());
		}
	}
}

function update_project_allocated_from_suggestion(frm) {
	const value = flt(frm.doc.custom_suggested_by_member_incharge_a__f);
	if (frm.doc.custom_project_allocated_amount !== value) {
		frm.set_value("custom_project_allocated_amount", value).then(() => frm.dirty());
	}
}
