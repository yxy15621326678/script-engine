import { GroovyCodeEditor } from "@coding-script/script-engine";

const HomePage = () => {

    return (
        <div>
            <h1>Home Page</h1>
            <GroovyCodeEditor
                value={`println("Hello, World!")`}
                onChange={(value) => {
                    console.log("Code changed:", value);
                }}
            />
        </div>
    );
};

export default HomePage;
