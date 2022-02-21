import React from "react";
import {ILanguage} from "@weare/reapptor-toolkit";
import {BaseComponent, IGlobalClick} from "@weare/reapptor-react-common";

import styles from "./LanguageDropdown.module.scss";

import daFlag from "./flags/da.png";
import deFlag from "./flags/de.png";
import enFlag from "./flags/en.png";
import fiFlag from "./flags/fi.png";
import nbFlag from "./flags/nb.png";
import noFlag from "./flags/no.png";
import plFlag from "./flags/pl.png";
import svFlag from "./flags/sv.png";
import ruFlag from "./flags/ru.png";
import ukFlag from "./flags/uk.png";

const flags: any = {
    da: daFlag,
    de: deFlag,
    en: enFlag,
    fi: fiFlag,
    nb: nbFlag,
    no: noFlag,
    pl: plFlag,
    sv: svFlag,
    ru: ruFlag,
    uk: ukFlag
};

interface ILanguageDropdownProps {
    className?: string;
    languages: readonly ILanguage[];
    currentLanguage: string;
    changeLanguageCallback?(language: string): void;
}

interface ILanguageDropdownState {
    currentLanguage: ILanguage;
    isOpen: boolean;
}

class LanguageDropdown extends BaseComponent<ILanguageDropdownProps, ILanguageDropdownState> implements IGlobalClick {
    state = {
        currentLanguage: this.props.languages.find(language => language.code === this.props.currentLanguage) as ILanguage,
        isOpen: false
    };
    
    private async dropdownToggleAsync(): Promise<void> {
        let isOpen: boolean = !this.state.isOpen;
        await this.setState({ isOpen });
    };
    
    private async closeDropdownAsync(): Promise<void> {
        await this.setState({ isOpen: false } );
    }

    private async onLanguageChangeAsync(language: ILanguage): Promise<void> {        
        if(this.state.currentLanguage.code !== language.code) {
            await this.setState({ currentLanguage: language });
            
            if(this.props.changeLanguageCallback) {
                this.props.changeLanguageCallback(language.code);
            }
        }
        
        await this.closeDropdownAsync();
    };

    public async onGlobalClick(e: React.SyntheticEvent): Promise<void> {
        let target = e.target as Node;
        let container = document.querySelector(`.${styles.dropdown}`);
        let outside: boolean = ((container != null) && (!container.contains(target)));
        if (outside) {
            await this.closeDropdownAsync();
        }
    }

    public render(): React.ReactNode {
        const className: string = (this.state.isOpen) ? styles.dropdown_open : styles.languages;
        
        return(
            <div className={this.css(styles.dropdown, this.props.className)}>
                <div className={styles.flag} onClick={async () => await this.dropdownToggleAsync()}>
                    <img src={flags[this.state.currentLanguage.code]} alt={this.state.currentLanguage.label}/>
                </div>

                <ul className={className}>
                    {
                        this.props.languages.map((language, index) => (
                            <li key={index} onClick={async () => await this.onLanguageChangeAsync(language)}>
                                <div className={styles.flag}>
                                    <img src={flags[language.code]} alt={language.label} />
                                </div>
                                
                                <label>{language.label}</label>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }

}

export default LanguageDropdown;