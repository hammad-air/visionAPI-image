const { OpenAI } = require("openai");
const openai = new OpenAI();

const assistant =  openai.beta.assistants.create({
    name: "Math Tutor",
    instructions:
        "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-1106-preview",
});

const thread =  openai.beta.threads.create();
const message =  openai.beta.threads.messages.create(thread.id, {

    role: "user",
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
});

const run = openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: "Please address the user as Mervin Prison.",    
});

console.log(run)

const checkStatusAndPrintMessages = async (threadId, runId) => {
    let runStatus =  openai.beta.threads.runs.retrieve(threadId, runId);
    if(runStatus.status === "completed"){
        let messages =  openai.beta.threads.messages.list(threadId);
        messages.data.forEach((msg) => {
            const role = msg.role;
            const content = msg.content[0].text.value; 
            console.log(
                `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
            );
        });
    } else {
        console.log("Run is not completed yet.");
    }  
};

setTimeout(() => {
    checkStatusAndPrintMessages(thread.id, run.id)
}, 10000 );
