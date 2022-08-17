import React from "react";
import {Utility} from "@weare/reapptor-toolkit";
import {BaseComponent, IGlobalClick, IGlobalKeydown} from "@weare/reapptor-react-common";
import { Dictionary } from "typescript-collections";

import styles from "./AutoSuggest.module.scss";

export class AutoSuggestItem {
    public group: string;
    
    public value: string;

    public isAutoSuggestItem: boolean;
    
    constructor(value: string | null | undefined = null, group: string | null | undefined = null) {
        this.value = value || "";
        this.group = group || "";
        this.isAutoSuggestItem = true;
    }
}

class AutoSuggestItemGroup {
    public name: string;
    
    public items: AutoSuggestItem[];
    
    constructor(name: string) {
        this.name = name;
        this.items = [];
    }
}

type AutoSuggestItemType = string | AutoSuggestItem;

interface IAutoSuggestProps  {
    items: AutoSuggestItemType[];
    toggleButtonId: string;
    isOpen?: boolean;
    className?: string;
    onSelect(sender: AutoSuggest, value: any): Promise<void>;
}

interface IAutoSuggestState {
    isOpen: boolean;
}

export default class AutoSuggest extends BaseComponent<IAutoSuggestProps, IAutoSuggestState> implements IGlobalClick, IGlobalKeydown {
    state: IAutoSuggestState = {
        isOpen: this.props.isOpen || false,
    };
    
    private get items(): AutoSuggestItem[] {
        const items: AutoSuggestItemType[] = this.props.items;
        if (items.length == 0) {
            return [];
        }
        if (items[0] instanceof AutoSuggestItem) {
            return items as AutoSuggestItem[];
        }
        return items.map(item => new AutoSuggestItem(item as string));
    }
    
    private get toggleButtonId(): string {
        return this.props.toggleButtonId;
    }
    
    private async onSelectAsync(item: AutoSuggestItem): Promise<void> {
        if(this.isMounted) {
            await this.props.onSelect(this, item.value);
            
            await this.closeAsync();
        }
    }
    
    private async closeAsync(): Promise<void> {
        if(this.isMounted) {
            if (this.state.isOpen) {
                await this.setState({isOpen: false})
            }
        }
    }

    private async openAsync(): Promise<void> {
        if(!this.state.isOpen) {
            await this.setState({isOpen: true})
        }
    }

    private groupBy(data: AutoSuggestItem[]): AutoSuggestItemGroup[] {
        const dictionary = new Dictionary<string, AutoSuggestItemGroup>();
        data.forEach(item => {
            let group: AutoSuggestItemGroup | undefined = dictionary.getValue(item.group);
            if (!group) {
                group = new AutoSuggestItemGroup(item.group);
                dictionary.setValue(item.group, group)
            }
            group.items.push(item);
        });
        return dictionary.values();
    }

    public get isOpen(): boolean {
        return this.state.isOpen;
    }

    public async toggleAsync(): Promise<void> {
        if (this.state.isOpen) {
            await this.closeAsync();
        } else {
            await this.openAsync();
        }
    }
    
    public async onGlobalClick(e: React.SyntheticEvent<Element, Event>): Promise<void> {
        const targetNode = e.target as Node;

        const outside = Utility.clickedOutside(targetNode, this.id, this.toggleButtonId);

        if (outside) {
            await this.closeAsync();
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if(e.keyCode === 27) {
            await this.closeAsync();
        }
    }

    public render(): React.ReactNode {
        const groups: AutoSuggestItemGroup[] = this.groupBy(this.items);
        
        return (
            <div id={this.id} className={this.css(this.props.className, styles.autoSuggest, this.isOpen && styles.open)}>
                {
                    (this.items.length > 0) && groups.map((group, index: number) => (
                            <div key={index} className={styles.container}>
                                
                                {
                                    (group.name) &&
                                    (
                                        <span className={styles.group}>{group.name}</span>
                                    )
                                }
                                
                                {
                                    group.items.map((item: any, index: number) => (
                                        <div key={index}
                                             className={styles.groupItem}
                                             onClick={() => this.onSelectAsync(item)}>{item.value}</div>
                                    ))
                                }
                                
                                { 
                                    (groups.length > 1 && index !== groups.length - 1) &&
                                    (
                                        <hr className={styles.groupSeparator} />
                                    )
                                }
                                
                            </div>
                        )
                    )
                }
            </div>
        )
    }
}