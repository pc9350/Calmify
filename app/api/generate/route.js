import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `
You are a classifier with a focus on emotional support. Your task is to determine the type of the user's input based on their emotional state. Classify the input into one of the following categories:

1. Greeting
2. Emotional Response (Sad, Calm, Confused, Surprised, Happy, Disgusted, Angry, Fearful)
3. Other

Return the classification type as a single word: 'greeting', 'emotional', or 'other'.
`;

const flashcardPrompt = `
You are a flashcard creator focused on emotional support. Generate supportive flashcards based on the user's emotional state:

1. If the user greets, respond warmly and empathetically.
2. Tailor flashcards to these emotions:
   - **Sad**: Offer comforting messages and positive affirmations.
   - **Calm**: Provide advice for relaxation and reflection.
   - **Confused**: Give clear guidance and simplify concepts.
   - **Surprised**: Share intriguing positive insights.
   - **Happy**: Affirm and encourage positive activities.
   - **Disgusted**: Provide neutral, supportive advice.
   - **Angry**: Offer calming strategies and constructive tips.
   - **Fearful**: Give reassuring advice and practical steps.
3. Create clear, supportive questions on the front.
4. Provide empathetic, actionable answers on the back.
5. Generate 5 flashcards per request.

Return in JSON format:

{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}`;

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    try {
        const data = await req.text();

        // Step 1: Classify the message
        const classificationCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: data }
            ],
            model: "gpt-4"
        });

        const classificationResult = classificationCompletion.choices[0].message.content.trim().toLowerCase();

        let flashcardsResponse;

        if (classificationResult === 'greeting') {
            flashcardsResponse = {
                flashcards: [{
                    front: "Hello! How can I assist you today?",
                    back: "Hello! How can I assist you today?"
                }]
            };
        } else if (classificationResult === 'emotional') {
            // Use flashcardPrompt for emotional classification
            const flashcardsCompletion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: flashcardPrompt },
                    { role: "user", content: data }
                ],
                model: "gpt-4"
            });

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
        } else {
            // Handle the "other" classification
            const generalResponseCompletion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "Provide a response to a general question or query." },
                    { role: "user", content: data }
                ],
                model: "gpt-3.5-turbo"
            });

            const generalResponse = generalResponseCompletion.choices[0].message.content.trim();

            flashcardsResponse = {
                flashcards: [{
                    front: generalResponse,
                    back: generalResponse
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