import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemAndFlashcardPrompt = `
You are an assistant focused on emotional support. 
Classify the user's input as 'greeting', 'emotional', or 'other'. 
If it's 'greeting', generate 5 warm and empathetic greeting flashcard. 
If it's 'emotional', create supportive flashcards tailored to the emotion:
   - **Sad**: Comforting messages and positive affirmations.
   - **Calm**: Advice for relaxation and reflection.
   - **Confused**: Clear guidance and simplification.
   - **Surprised**: Intriguing positive insights.
   - **Happy**: Affirming and encouraging activities.
   - **Disgusted**: Neutral and supportive advice.
   - **Angry**: Calming strategies and constructive tips.
   - **Fearful**: Reassuring advice and practical steps.
For 'other', generate 5 general supportive flashcard.
Return a set of flashcards in JSON format:

{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}
`;

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    try {
        const data = await req.text();

        // Single API call to classify and generate flashcardsFeeling sad?It's okay to feel sad. Remember that it's a natural emotion. Take your time to process your feelings and reach out for support whe
        const flashcardsCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemAndFlashcardPrompt },
                { role: "user", content: data }
            ],
            model: "gpt-3.5-turbo"
        });

        let flashcardsResponse;
        try {
            flashcardsResponse = JSON.parse(flashcardsCompletion.choices[0].message.content);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            flashcardsResponse = {
                flashcards: [{
                    front: "I'm sorry, but there was an error processing your request.",
                    back: ""
                }]
            };
        }

        return NextResponse.json(flashcardsResponse);
    } catch (error) {
        console.error("Error handling request:", error);
        return NextResponse.json({
            flashcards: [{
                front: "An error occurred. Please try again later.",
                back: ""
            }]
        });
    }
}

// export async function POST(req) {
//     const openai = new OpenAI({
//         apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     });

//     try {
//         const data = await req.text();
        
//         const classificationCompletion = await openai.chat.completions.create({
//             messages: [
//                 { role: "system", content: systemPrompt },
//                 { role: "user", content: data }
//             ],
//             model: "gpt-4"
//         });

//         const classificationResult = classificationCompletion.choices[0].message.content.trim().toLowerCase();

//         let flashcardsResponse;
//         if (classificationResult === 'greeting') {
//             flashcardsResponse = {
//                 flashcards: [{
//                     front: "Hello! How can I assist you today?",
//                     back: "Hello! How can I assist you today?"
//                 }]
//             };
//         } else if (classificationResult === 'emotional') {
//             const flashcardsCompletion = await openai.chat.completions.create({
//                 messages: [
//                     { role: "system", content: flashcardPrompt },
//                     { role: "user", content: data }
//                 ],
//                 model: "gpt-4"
//             });

//             try {
//                 flashcardsResponse = JSON.parse(flashcardsCompletion.choices[0].message.content);
//             } catch (error) {
//                 console.error("Error parsing JSON:", error);
//                 flashcardsResponse = {
//                     flashcards: [{
//                         front: "I'm sorry, but there was an error processing your request.",
//                         back: ""
//                     }]
//                 };
//             }
//         } else {
//             const generalResponseCompletion = await openai.chat.completions.create({
//                 messages: [
//                     { role: "system", content: "Provide a response to a general question or query." },
//                     { role: "user", content: data }
//                 ],
//                 model: "gpt-4"
//             });

//             const generalResponse = generalResponseCompletion.choices[0].message.content.trim();

//             flashcardsResponse = {
//                 flashcards: [{
//                     front: generalResponse,
//                     back: generalResponse
//                 }]
//             };
//         }

//         return NextResponse.json(flashcardsResponse);
//     } catch (error) {
//         console.error("Error handling request:", error);
//         return NextResponse.json({
//             flashcards: [{
//                 front: "An error occurred. Please try again later.",
//                 back: ""
//             }]
//         });
//     }
// }