import { App, PluginSettingTab, Setting } from "obsidian";
import WikipediaPastePlugin from "./main";

export interface WikipediaPastePluginSettings {
	enableLinkTranslating: boolean;
	enableCitationRemoval: boolean;
	debugMode: boolean;
}

export const DEFAULT_SETTINGS: Partial<WikipediaPastePluginSettings> = {
	enableLinkTranslating: true,
	enableCitationRemoval: true,
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

		new Setting(containerEl)
			.setHeading()
			.setName("Wikipedia Links")
			.setDesc("Settings related to Wikipedia article links.");

		new Setting(containerEl)
			.setName("Enable Wikipedia Link Translating")
			.setDesc(
				"Toggling this option will enable the translating of Wikipedia links into Obsidian's double square bracket links.",
			)
			.addToggle((value) => {
				value
					.setValue(this.plugin.settings.enableLinkTranslating)
					.onChange(async (value) => {
						this.plugin.settings.enableLinkTranslating = value;
						this.plugin.logger.debugLog(
							"wikipedia link translating",
							value ? "on" : "off",
						);
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setHeading()
			.setName("Citations")
			.setDesc("Settings related to Wikipedia citations.");

		new Setting(containerEl)
			.setName("Enable Wikipedia Citation Removal")
			.setDesc(
				"Toggling this option will enable the removal of Wikipedia citations.",
			)
			.addToggle((value) => {
				value
					.setValue(this.plugin.settings.enableCitationRemoval)
					.onChange(async (value) => {
						this.plugin.settings.enableCitationRemoval = value;
						this.plugin.logger.debugLog(
							"citation removal",
							value ? "on" : "off",
						);
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl).setHeading().setName("Development");

		new Setting(containerEl)
			.setName("Debug Mode")
			.setDesc(
				"Enabling debug mode turn on logs to the Obsidian console.",
			)
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
