frappe.views.ListView = class extends frappe.views.ListView {
	get_meta_html(doc) {
		let html = "";

		let settings_button = null;

		if (Array.isArray(this.settings.button)) {
			settings_button = '';
			for (const button of this.settings.button) {
				if (!button.name) {
					frappe.throw("Button needs a unique 'name' when using multiple buttons.");
				}

				if (button && button.show(doc)) {
					settings_button += `
						<span class="list-actions">
							<button class="btn btn-action btn-default btn-xs"
								data-name="${doc.name}" data-idx="${doc._idx}" data-action="${button.name}"
								title="${button.get_description(doc)}">
								${button.get_label(doc)}
							</button>
						</span>
					`;
				}
			}
		} else {
			if (this.settings.button && this.settings.button.show(doc)) {
				settings_button = `
					<span class="list-actions">
						<button class="btn btn-action btn-default btn-xs"
							data-name="${doc.name}" data-idx="${doc._idx}"
							title="${this.settings.button.get_description(doc)}">
							${this.settings.button.get_label(doc)}
						</button>
					</span>
				`;
			}
		}

		const modified = comment_when(doc.modified, true);

		let assigned_to = `<div class="list-assignments">
			<span class="avatar avatar-small">
			<span class="avatar-empty"></span>
		</div>`;

		let assigned_users = JSON.parse(doc._assign || "[]");
		if (assigned_users.length) {
			assigned_to = `<div class="list-assignments">
					${frappe.avatar_group(assigned_users, 3, { filterable: true })[0].outerHTML}
				</div>`;
		}

		const comment_count = `<span class="${
			!doc._comment_count ? "text-extra-muted" : ""
		} comment-count">
				${frappe.utils.icon('small-message')}
				${doc._comment_count > 99 ? "99+" : doc._comment_count}
			</span>`;

		html += `
			<div class="level-item list-row-activity hidden-xs">
				<div class="hidden-md hidden-xs">
					${settings_button || assigned_to}
				</div>
				${modified}
				${comment_count}
			</div>
			<div class="level-item visible-xs text-right">
				${this.get_indicator_dot(doc)}
			</div>
		`;

		return html;
	}

	setup_action_handler() {
		this.$result.on("click", ".btn-action", (e) => {
			const $button = $(e.currentTarget);
			const doc = this.data[$button.attr("data-idx")];
			const btnName = $button.attr('data-action');

			if (Array.isArray(this.settings.button)) {
				const button = this.settings.button.find(b => b.name == btnName);
				button.action(doc, $button);
			} else {
				this.settings.button.action(doc, $button);
			}

			e.stopPropagation();
			return false;
		});
	}
}
