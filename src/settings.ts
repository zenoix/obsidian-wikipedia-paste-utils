import { App, PluginSettingTab, Setting } from "obsidian";
import WikipediaPastePlugin from "./main";

export interface WikipediaPastePluginSettings {
	debugMode: boolean;
}

export const DEFAULT_SETTINGS: Partial<WikipediaPastePluginSettings> = {
	debugMode: false,
};

export class WikipediaPastePluginSettingTab extends PluginSettingTab {
	plugin: WikipediaPastePlugin;

	constructor(app: App, plugin: WikipediaPastePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setHeading().setName("Development");

		new Setting(containerEl)
			.setName("Debug Mode")
			.setDesc("Toggle debug mode")
			.addToggle((value) => {
				value
					.setValue(this.plugin.settings.debugMode)
					.onChange(async (value) => {
						this.plugin.settings.debugMode = value;
						this.plugin.logger.debugLog(
							"debug mode",
							value ? "on" : "off",
						);
						await this.plugin.saveSettings();
					});
			});
	}
}
