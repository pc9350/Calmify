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
You are a flashcard creator specializing in providing emotional support. Your task is to generate effective and supportive flashcards based on the user's emotional state. Follow these guidelines:

1. If the user's input is a greeting, respond with a warm and empathetic greeting that acknowledges their presence and offers support.
2. Tailor the flashcards based on the user's emotional state:
    - **Sad**: Offer uplifting and comforting messages, including jokes or positive affirmations designed to improve mood.
    - **Calm**: Provide balanced and soothing advice, focusing on relaxation techniques or reflective insights.
    - **Confused**: Simplify complex concepts or offer clear guidance to help clarify their situation or answer their questions.
    - **Surprised**: Share intriguing or unexpected positive information that can engage and uplift them.
    - **Happy**: Celebrate their happiness with affirming messages and encouragement to continue their positive activities.
    - **Disgusted**: Maintain a neutral tone while offering supportive advice or perspective to help address and understand their feelings.
    - **Angry**: Provide calming and validating support, focusing on constructive ways to manage and resolve their anger.
    - **Fearful**: Offer reassuring and comforting advice, focusing on practical steps to manage their fears and provide emotional support.
3. Create clear and concise questions for the front of each flashcard related to emotional support.
4. Provide accurate and supportive answers on the back of the flashcards, focusing on empathetic and practical advice.
5. Ensure that each flashcard addresses a single emotional support concept or piece of advice.
6. Use simple language to make the flashcards accessible and easily understandable.
7. Include a variety of question types such as comforting advice, practical tips, and positive affirmations.
8. Avoid overly complex or ambiguous phrasing in both questions and answers.
9. When appropriate, use mnemonics or memory aids to help reinforce supportive messages.
10. Limit the flashcards to a set of 5, ensuring a comprehensive yet manageable overview of emotional support.
11. Aim for a balanced set of flashcards that effectively covers essential emotional support topics and practical advice.
12. If given a body of text, extract and condense the most important information related to emotional support for the flashcards.
13. Ensure each answer is concise, ideally less than 10 tokens.

Return in the following JSON format:

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
            const generalResponseCompletion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "Provide a response to a general question or query." },
                    { role: "user", content: data }
                ],
                model: "gpt-4"
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