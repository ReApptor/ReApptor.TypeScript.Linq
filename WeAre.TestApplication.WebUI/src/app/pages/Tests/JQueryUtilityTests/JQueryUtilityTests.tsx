import React from "react";
import {BaseComponent, ch, IGlobalResize, IGlobalScroll, JQueryUtility} from "@weare/reapptor-react-common";
import {Button, ButtonContainer} from "@weare/reapptor-react-components";

import styles from "./JQueryUtilityTests.module.scss";

class Target {
    targetId: string = "";
    node: JQuery<Node> = {} as JQuery<Node>;
    offsetLeft: number = 0;
    viewportLeft: number = 0;
    viewportRight: number = 0;
    viewportTop: number = 0;
    viewportBottom: number = 0;
    offsetTop: number = 0;
    offsetRight: number = 0;
    offsetBottom: number = 0;
    width: number = 0;
    height: number = 0;
    marginLeft: number = 0;
    marginTop: number = 0;
    marginBottom: number = 0;
    marginRight: number = 0;
    borderLeft: number = 0;
    borderRight: number = 0;
    borderTop: number = 0;
    borderBottom: number = 0;
    innerWidth: number = 0;
    innerHeight: number = 0;
}

interface IJQueryUtilityTestsState {
    borders: boolean;
    scrollX: boolean;
    scrollY: boolean;
    targeting: boolean;
    target: Target | null;
}

export default class JQueryUtilityTests extends BaseComponent<{}, IJQueryUtilityTestsState> implements IGlobalResize, IGlobalScroll {

    state: IJQueryUtilityTestsState = {
        borders: true,
        scrollX: true,
        scrollY: true,
        targeting: false,
        target: null
    };
    
    private fillNode(target: Target): void {
        target.marginLeft = parseInt(target.node.css("margin-left")) || 0;
        target.marginTop = parseInt(target.node.css("margin-top")) || 0;
        target.marginBottom = parseInt(target.node.css("margin-bottom")) || 0;
        target.marginRight = parseInt(target.node.css("margin-right")) || 0;
        
        target.borderTop = parseInt(target.node.css("border-top-width")) || 0;
        target.borderLeft = parseInt(target.node.css("border-left-width")) || 0;
        target.borderBottom = parseInt(target.node.css("border-bottom-width")) || 0;
        target.borderRight = parseInt(target.node.css("border-right-width")) || 0;

        target.width = JQueryUtility.outerWidth(target.node, true);
        target.height = JQueryUtility.outerHeight(target.node, true);
        target.innerWidth = JQueryUtility.innerWidth(target.node) + target.borderLeft + target.borderRight;
        target.innerHeight = JQueryUtility.innerHeight(target.node) + target.borderTop + target.borderBottom;

        target.offsetLeft = JQueryUtility.offsetLeft(target.node, true);
        target.offsetTop = JQueryUtility.offsetTop(target.node, true);

        target.viewportLeft = target.offsetLeft - JQueryUtility.viewportScrollLeft();
        target.viewportRight = target.offsetRight - JQueryUtility.viewportScrollLeft();
        target.viewportTop = target.offsetTop - JQueryUtility.viewportScrollTop();
        target.viewportBottom = target.offsetBottom - JQueryUtility.viewportScrollTop();
        
        //target.offsetRight = JQueryUtility.viewportWidth() - target.offsetLeft - target.width;
        
        target.offsetRight = JQueryUtility.offsetRight(target.node);
    }

    public async onGlobalResize(e: React.SyntheticEvent): Promise<void> {
        if (this.target) {
            this.fillNode(this.target);
        }
        await this.reRenderAsync();
    }

    public async onGlobalScroll(e: React.SyntheticEvent): Promise<void> {
        if (this.target) {
            this.fillNode(this.target);
        }
        await this.reRenderAsync();
    }

    public async onMouseMove(e: MouseEvent): Promise<void> {
        if (this.state.targeting) {
            const target = e.target as Node;
            const targetNode: JQuery<Node> = JQueryUtility.$(target);
            if (targetNode.length) {
                let targetId: string | undefined = targetNode.attr("id");
                if (!targetId) {
                    targetId = ch.getComponentId();
                    targetNode.attr("id", targetId);
                }
                let stateTarget = this.state.target;
                if ((stateTarget == null) || (stateTarget.targetId !== targetId)) {
                    
                    stateTarget = new Target();
                    stateTarget.targetId = targetId;
                    stateTarget.node = targetNode;
                    this.fillNode(stateTarget);
                    
                    await this.setState({target: stateTarget});
                }
            }
        }
    }
    
    public async toggleScrollXAsync(): Promise<void> {
        await this.setState({ scrollX: !this.state.scrollX });
    }
    
    public async toggleScrollYAsync(): Promise<void> {
        await this.setState({ scrollY: !this.state.scrollY });
    }
    
    public async toggleBordersAsync(): Promise<void> {
        await this.setState({ borders: !this.state.borders });
    }
    
    public async toggleTargetingAsync(): Promise<void> {
        const targeting: boolean = !this.state.targeting;
        const target = targeting ? this.state.target : null;
        await this.setState({ targeting, target });
    }
    
    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        window.addEventListener("mousemove", async (e) => await this.onMouseMove(e), false);
    }
    
    public get target(): Target | null {
        return this.state.target;
    }
    
    public renderArrowUp(x: number, y: number): React.ReactNode {
        return (
            <div className={styles.arrowUp}
                 style={
                     {
                         position: "fixed",
                         zIndex: 11000,
                         width: "1px",
                         bottom: "auto",
                         left: x,
                         right: x,
                         top: 0,
                         height: y,
                         userSelect: "none",
                         pointerEvents: "none",
                     }
                 }
            >
                <div className={styles.point}/>
                <span>{y.format("0.00")}px</span>
            </div>
        )
    }
    
    public renderArrowDown(x: number, y: number): React.ReactNode {
        return (
            <div className={styles.arrowDown}
                 style={
                     {
                         position: "fixed",
                         zIndex: 11000,
                         width: "1px",
                         left: x,
                         right: x,
                         top: y,
                         bottom: 0,
                         userSelect: "none",
                         pointerEvents: "none",
                     }
                 }
            >
                <div className={styles.point}/>
                <span>{y.format("0.00")}px</span>
            </div>
        )
    }
    
    public renderArrowLeft(x: number, y: number): React.ReactNode {
        return (
            <div className={styles.arrowLeft}
                 style={
                     {
                         position: "fixed",
                         zIndex: 11000,
                         height: "1px",
                         right: "auto",
                         bottom: "auto",
                         left: 0,
                         width: x,
                         top: y,
                         userSelect: "none",
                         pointerEvents: "none",
                     }
                 }
            >
                <div className={styles.point}/>
                <span>{x.format("0.00")}px</span>
            </div>
        )
    }
    
    public renderArrowRight(x: number, y: number): React.ReactNode {
        return (
            <div className={styles.arrowRight}
                 style={
                     {
                         position: "fixed",
                         zIndex: 11000,
                         height: "1px",
                         right: 0,
                         bottom: "auto",
                         left: x,
                         top: y,
                         userSelect: "none",
                         pointerEvents: "none",
                     }
                 }
            >
                <div className={styles.point}/>
                <span>{(JQueryUtility.viewportWidth() - x).format("0.00")}px</span>
            </div>
        )
    }

    public render(): React.ReactNode {
        return (
            <div style={{margin: "1rem 0"}} className={styles.jQueryUtilityTests}>
                <div className="mb-3">
                    
                    <ButtonContainer>
                        
                        <Button label={"Toggle Scroll X"} onClick={() => this.toggleScrollXAsync()} />
                        <Button label={"Toggle Scroll Y"} onClick={() => this.toggleScrollYAsync()} />
                        <Button label={"Toggle Borders"} onClick={() => this.toggleBordersAsync()} />
                        <Button label={"Toggle Targeting"} onClick={() => this.toggleTargetingAsync()} />
                        <Button label={"ReRender"} onClick={() => this.reRenderAsync()} />
                        
                    </ButtonContainer>
                    
                    <hr/>

                    {/*{ this.renderArrowUp(100, 100) }*/}
                    {/*{ this.renderArrowDown(200, 200) }*/}
                    {/*{ this.renderArrowLeft(100, 100) }*/}
                    {/*{ this.renderArrowRight(200, 200) }*/}
                    
                    <div style={
                        {
                            width: this.state.scrollX ? "2000px" : "auto",
                            height: this.state.scrollY ? "2000px" : "auto",
                            border: "solid 2px black",
                            display: "inline-block",
                        }
                    }>
                        [Context To Generate scrolling]

                        {
                            ((this.state.targeting) && (this.target)) &&
                            (
                                <div>
                                    <p>id: {this.target.targetId}</p>
                                    <p>tag: {this.target.node.prop("tagName")}</p>
                                    <p>offsetLeft: {this.target.offsetLeft}</p>
                                    <p>offsetTop: {this.target.offsetTop}</p>
                                    <p>offsetRight: {this.target.offsetRight}</p>
                                    <p>offsetBottom: {this.target.offsetBottom}</p>
                                    <p>viewportLeft: {this.target.viewportLeft}</p>
                                    <p>viewportRight: {this.target.viewportRight}</p>
                                    <p>viewportTop: {this.target.viewportTop}</p>
                                    <p>viewportBottom: {this.target.viewportBottom}</p>
                                    <p>marginLeft: {this.target.marginLeft}</p>
                                    <p>marginTop: {this.target.marginTop}</p>
                                    <p>width: {this.target.width}</p>
                                    <p>height: {this.target.height}</p>
                                    <p>innerWidth: {this.target.innerWidth}</p>
                                    <p>innerHeight: {this.target.innerHeight}</p>
                                    <p>-</p>
                                    <p>viewport width: {JQueryUtility.viewportWidth()}</p>
                                    <p>viewport height: {JQueryUtility.viewportHeight()}</p>
                                </div>
                            )
                        }
                    </div>

                    {
                        ((this.state.targeting) && (this.target)) &&
                        (
                            <>

                                <div id={"target_inner"}
                                     style={
                                         {
                                             position: "absolute",
                                             zIndex: 11000,
                                             left: this.target.offsetLeft + this.target.marginLeft,
                                             top: this.target.offsetTop + this.target.marginTop,
                                             width: this.target.innerWidth,
                                             height: this.target.innerHeight,
                                             border: "solid 2px grey",
                                             userSelect: "none",
                                             pointerEvents: "none",
                                         }
                                     }
                                />
                                
                                <div id={"target_outer"}
                                     style={
                                        {
                                            position: "absolute",
                                            zIndex: 11000,
                                            left: this.target.offsetLeft,
                                            top: this.target.offsetTop,
                                            width: this.target.width,
                                            height: this.target.height,
                                            border: "solid 3px black",
                                            userSelect: "none",
                                            pointerEvents: "none",
                                        }
                                    }
                                />

                                { this.renderArrowUp(this.target.viewportLeft, this.target.viewportTop) }
                                { this.renderArrowLeft(this.target.viewportLeft, this.target.viewportTop) }
                                { this.renderArrowDown(this.target.viewportLeft + this.target.width, this.target.viewportTop + this.target.height) }
                                { this.renderArrowRight(this.target.viewportLeft + this.target.width, this.target.viewportTop + this.target.height) }
                                
                            </>
                        )
                    }

                    {
                        (this.state.borders) &&
                        (
                            <>
                                <div id={"document_fixed"}
                                     style={
                                         {
                                             position: "fixed",
                                             zIndex: 10000,
                                             left: 0,
                                             top: 0,
                                             width: JQueryUtility.documentWidth(),
                                             height: JQueryUtility.documentHeight(),
                                             border: "solid 10px yellow",
                                             userSelect: "none",
                                             pointerEvents: "none",
                                         }
                                     }
                                />

                                <div id={"viewport_fixed"}
                                     style={
                                         {
                                             position: "fixed",
                                             zIndex: 10000,
                                             left: 0,
                                             top: 0,
                                             width: JQueryUtility.viewportWidth(),
                                             height: JQueryUtility.viewportHeight(),
                                             border: "solid 7px blue",
                                             userSelect: "none",
                                             pointerEvents: "none",
                                         }
                                     }
                                />

                                <div id={"viewport_absolute"}
                                     style={
                                         {
                                             position: "absolute",
                                             zIndex: 10000,
                                             left: JQueryUtility.viewportOffsetLeft(),
                                             top: JQueryUtility.viewportOffsetTop(),
                                             width: JQueryUtility.viewportWidth(),
                                             height: JQueryUtility.viewportHeight(),
                                             border: "solid 4px green",
                                             userSelect: "none",
                                             pointerEvents: "none",
                                         }
                                     }
                                />

                                <div id={"document"} />
                            </>
                        )
                    }
                    
                </div>
            </div>
        );
    }
}