import { ScriptCodeEditor } from "@coding-script/script-engine";

const HomePage = () => {

    return (
        <div>
            <h1>Home Page</h1>
            <ScriptCodeEditor
                value={`println("Hello, World!")`}
                onChange={(value: string) => {
                    console.log("Code changed:", value);
                }}
            />
        </div>
    );
};

export default HomePage;
