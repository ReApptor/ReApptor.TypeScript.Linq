import {ApplicationContext, BasePage} from "@weare/athenaeum-react-common";

export default abstract class AnonymousPage<TProps = {}, TState = {}>
    extends BasePage<TProps, TState, ApplicationContext> {
}