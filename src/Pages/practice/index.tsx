import SessionDataProvider from "./components/sessionDataProvider/sessionDataProvider";
import Page from "./practicePage";

export default function PracticePage() {
    return (
        <SessionDataProvider>
            <Page/>
        </SessionDataProvider>
    )
}