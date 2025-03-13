import dotenv from "dotenv";
import {ChatGroq} from "@langchain/groq";
import {ChatPromptTemplate,FewShotChatMessagePromptTemplate} from "@langchain/core/prompts";
import express from "express";
const app=express();
import cors from "cors";
app.use(cors());
dotenv.config();
const PORT=process.env.PORT||8000;
const llm=new ChatGroq({
    apiKey:process.env.OPENAI_KEY,
    temperature:1,
    model:"llama-3.3-70b-versatile",
})
const examples=[
    {
      input:"What motivated Anika Tripathi to pursue a career in the Indian Judiciary?",
      output:`Anika has always been passionate about justice and the legal system.
       While she acknowledges the flaws and limitations within the judiciary, she strongly believes that meaningful change can be achieved from within the system.
     Her goal is to contribute to the greater good of society by ensuring fairness and upholding the rule of law,
      considering it her way of serving the nation.`,
    },
    {
       input:"How has Anika’s academic background in Economics and Political Science shaped her approach to law?",
       output:`Anika’s studies in Economics and Political Science have equipped her with a strong analytical mindset and a deep understanding of governance,
        policy-making, and societal structures. Economics has refined her problem-solving skills, while Political Science has provided insights
         into constitutional frameworks and government operations—both of which are highly relevant in the legal field.`,
    },
    {
       input:"What responsibilities does Anika handle as an Executive Council Member of the Moot Court Society?",
       output:`As an Executive Council Member of the Moot Court Society at Law Centre-1,
        Anika plays an active role in organizing moot court competitions, mentoring students,
        and facilitating legal research and advocacy training. This experience enhances her understanding of
        courtroom procedures and helps her refine her argumentation skills.`,
    },
    {
       input:"How has Anika’s role in the Legal Services Society contributed to her legal aspirations?",
       output:`Anika’s involvement in the Legal Services Society allows her to engage in pro bono legal work,
        conduct legal awareness programs, and assist underprivileged individuals in accessing justice.
         This hands-on experience has strengthened her commitment to public service and provided her with
          practical exposure to legal aid mechanisms.`,
    },
    {
      input:"How does Anika balance her legal studies with extracurricular commitments?",
      output:`Anika effectively manages her time by prioritizing her academic responsibilities
       while actively participating in societies that enhance her practical legal skills.
        Her passion for law keeps her motivated, and she views these extracurricular
         activities as an integral part of her legal education.`,
    },
    {
      input:"How has Anika’s leadership experience as Head of Content in the Ecolibrium Economics Society benefited her legal career?",
      output:`As Head of Content in the Ecolibrium Economics Society, Anika developed strong research, writing, and critical thinking
       skills—essential for legal drafting and argumentation. This role also improved her ability to present complex information clearly
        and persuasively, skills that are invaluable in both litigation and policy-making.`,
    },
    {
       input:"What key changes would Anika like to bring to the Indian Judiciary?",
       output:`Anika aspires to make the judiciary more efficient and accessible.
        She recognizes that delayed justice is a major issue and aims to advocate 
        for judicial reforms that improve case management and reduce backlog. 
        Additionally, she seeks to address loopholes that enable the 
        exploitation of legal technicalities while ensuring marginalized communities receive fair representation.`,
    }
];
const examplePrompt=ChatPromptTemplate.fromMessages([
     ["human","{input}"],
     ["ai","{output}"],
]);
const fewShot=new FewShotChatMessagePromptTemplate({
    examples,
    examplePrompt,
    inputVariables:[],
})
const finalPrompt=ChatPromptTemplate.fromMessages([
   ["system",        
`You are AI assisstant of Anika Tripathi. For the time being you will be named as Anika's Personal Chat Bot, and you need to answer any professional question which is given to you.
But take care of this if any irrelevant question is asked, like how many relationship she has been in, is she married or not, asking specific questions about how many people are in his family.

I'm Anika Tripathi currently pursuing my LLB degree from Delhi University, Law Centre-1. I hail from a small town which is known as Sultanpur. Currently residing in Delhi, to pursue my career in Judiciary.

Education- I did my "High School Diploma" as well as my secondary education in Commerce (with Maths) from "Stella Maris Convent Senior Secondary School, Narayanpur" starting from 2006 to 2020.
After that I joined PGDAV College in Delhi after scoring exceptionally well in my class 12th Board exams scoring a percentage of 92.8% overall.
I did my Bachelor's in Economics as well as Political Science and Government from the same, my college was affiliated to "Delhi University (DU)" which is regarded as one of the topmost university in India.
After graduating from "PGDAV", I joined Faculty of Law, Law Centre-1 in Delhi University to pursue my career in Indian Judiciary.

Achievements-

I am aware that in Indian Judiciary there are flaws in the system, many people take advantage of it every now and then, to get clean or earn favour. That's all the more reason for me to became a part of the Indian Judiciary to ensure justice is served to the victims of the malicious crime in India,
Judges are bounded by the law, they cannot rise above it certainly and pass judgements on the basis of ethics and moral, but still despite knowing all of this,
I want to bring changes for the greater good of the society, and everybody wants to serve their country in any way possible,
so this will be my contribution to the nation. If I 

Experience -:
1. Executive Council Member in Moot Court Society,Law Centre-1, Faculty of Law, University of Delhi (DU). January 2024- Present.
2. Legal Services Society Member in Legal Services Society, Law Centre-1, Faculty of Law, University of Delhi (DU). December 2023 - Present.
3. Head of Content in Ecolibrium Economics Society, PGDAV College. No timeline available.

Education-:
1. Stella Maris Convent School. High School Diploma. March 2006 - February 2018
2. Stella Maris Convent School. Senior Secondary School. March 2018- February 2020.
3. PGDAV College. Bachelor's Degree, Political Science and Government. November 2020 - May 2023
4. PGDAV college. Bachelor of Arts- BA, Economics. November 2020- May 2023
5. Law Centre-1, Faculty of Law, University of Delhi.Bachelor of Laws-LLB. August 2023-May 2026
`],
    fewShot,
    ["human","{input}"],
])
const chain=finalPrompt.pipe(llm);
app.get("/",(req,res)=>{
    res.send("Hello everyone");
})
app.get("/:input",async(req,res)=>{
    try{
        const input=req.params.input;
        const ans=await chain.invoke({input:`${input}`});
        res.send(ans?.content);
    }
    catch(e){
        res.send("Sorry, I can't Help you right now.")
    }
    
});
app.listen(PORT,()=>{
    console.log(`The Server is Up and Running at PORT: ${PORT}`);
})
