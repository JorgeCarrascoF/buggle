import Accordion from "./Accordion";
import "highlight.js/styles/atom-one-dark.css";
import CodeFragment from "./CodeFragment";
import Stepper from "./Stepper";
import TextInput from "./TextInput";
import { useState } from "react";
import Button from "./Button";

const stepsData = [
  { title: "Log into Github", description: "Access into your Github Account" },
  {
    title: "Go to Token Configuration",
    description: "Go to Settings > Developer Settings > Personal Access Tokens",
  },
  {
    title: "Create a token",
    description: "You'll need to create a Fine-grained Token",
  },
  {
    title: "Configure and generate the token",
    description:
      "Add a descriptive name, the repository it will access, and the permissions it needs (generally repo)",
  },
  {
    title: "Save the token",
    description:
      "The token is shown only once after generating it. Please make sure to copy it!",
  },
];

const sentryScript = `
Sentry.init({
  dsn: "https://c8f07b4b38b745219e04a09995e7f343@backend-llwm.onrender.com/42",
  sendDefaultPii: true,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "development",
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ["error", "warn", "info"],
    }),
  ],
});
`;

const dependenciesScript = `
npm install @sentry/react
`;

const importScript = `
import * as Sentry from "@sentry/react";
`;

const envScript = `
VITE_SENTRY_ENVIRONMENT=development
`;

const envProductionScript = `
VITE_SENTRY_ENVIRONMENT=production
`;

const OnboardingComponent = () => {
  const [ghToken, setGhToken] = useState("");
  const [repoLink, setRepoLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setGhToken("");
    setRepoLink("");
  };

  return (
    <div className="w-full h-full flex flex-col  items-center">
      <div className="text-center w-[55rem] flex flex-col items-center">
        <h2 className="text-[40px] font-bold mb-2 leading-snug">
          Start with Buggle, <br></br> manage your logs easily
        </h2>
        <p className="text-gray-500 text-xl mb-14">
          Learn how to set up Buggle and explore everything you need to start
          using it!
        </p>

        <div className="w-[95%] flex flex-col gap-3">
          <Accordion title="Integration setup: Connecting Buggle to your System">
            <span className="text-sm text-black">
              To start using Buggle, the first step is to link it with your
              system.
            </span>
            <div className="w-full ml-4 text-black">
              <h3 className="font-semibold text-sm my-3">
                1. Add the Buggle script to your main project file
              </h3>
              <div>
                <span className="text-sm">
                  You need to install the dependencies:
                </span>
                <CodeFragment text={dependenciesScript} language="ini" />
              </div>
              <div className="">
                <span className="text-sm">
                  Then, import them into your main file:
                </span>
                <CodeFragment text={importScript} language="js" />
              </div>
              <div>
                <span className="text-sm">
                  And then, add the following snippet:
                </span>
                <CodeFragment text={sentryScript} language="js" />
              </div>
              <h3 className="font-semibold text-sm my-3">
                {" "}
                2. Set the environment variable
              </h3>
              <div>
                <span className="text-sm">
                  Insert the following snippet into your main file:
                </span>
                <CodeFragment text={envScript} language="ini" />
              </div>
              <h3 className="font-semibold text-sm my-3">
                {" "}
                3. Configure for deployment
              </h3>
              <div>
                <span className="text-sm">
                  {" "}
                  When deploying your project, make sure to update the
                  environment variable value to:
                </span>
                <CodeFragment text={envProductionScript} language="ini" />
              </div>
            </div>
            <span className="text-sm text-black">
              That’s it! You’ve successfully linked Buggle to your system and
              set up your environments.
            </span>
          </Accordion>

          <Accordion title="AI Assistant Configuration">
            <span className="text-sm text-[#737373]">
              We offer a AI Assistant that can help you resolve bugs. To set it
              up, you'll need to provide a GitHub repository link and a GitHub
              token to access it.
            </span>
            <h3 className="mb-7 mt-12 text-black font-semibold">
              1. Getting a Github Token
            </h3>
            <Stepper steps={stepsData} />

            <h3 className="mb-7 mt-12 text-black font-semibold">
              2. Getting the Repository Link{" "}
            </h3>
            <span className="text-sm text-[#737373]">
              Navigate to the main page of the repository you want to use, and
              copy the URL from the address bar.
            </span>

            <h3 className="mb-7 mt-12 text-black font-semibold">
              3. Provide both items{" "}
            </h3>
            <span className="text-sm text-[#737373]">
              We will use both the token and the repository link to generate
              suggestions based on the commits. Please provide them in the
              fields below:
            </span>
            <div className="w-full flex justify-center">
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-4 bg-[#FAFAFA] border border-[#E5E8EB] p-6 w-[65%] rounded-lg"
              >
                <TextInput
                  label="GitHub Token"
                  placeholder={"Enter your GitHub Token..."}
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                />
                <TextInput
                  label="Repository Link"
                  placeholder={"Enter your Repository Link..."}
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                />
                <div className=" flex justify-end ">
                  <div className="w-[30%]">
                    <Button type="submit" disabled={!ghToken || !repoLink}>
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComponent;
