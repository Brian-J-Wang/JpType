import { CharacterSetProvider } from "./components/characterSetProvider/characterSetProvider";
import SessionDataProvider from "./components/sessionData/sessionDataProvider";
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