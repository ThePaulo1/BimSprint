import {getTheme} from "../app/lib/cookies";
import ThemePicker from "./ThemePicker";

export default async function Settings() {
    const defaultTheme = await getTheme()


    return (
        <div>
            <div>Settings
            </div>
            <ThemePicker defaultTheme={defaultTheme}/>
        </div>
    )
}