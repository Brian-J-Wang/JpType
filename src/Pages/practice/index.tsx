import { CharacterSetProvider } from "./components/characterSetProvider/characterSetProvider";
import SessionDataProvider from "./components/sessionDataProvider/sessionDataProvider";
import Page from "./practicePage";

export default function PracticePage() {
    return (
        <CharacterSetProvider>
        <SessionDataProvider>
            <Page/>
        </SessionDataProvider>
        </CharacterSetProvider>
    )
}