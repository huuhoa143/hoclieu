const getAnswer = require("./api/getAnswer")
const getQuestions = require("./api/getQuestions")
const submitAnswer = require("./api/submitAnswer")
const prompts = require('prompts')

const _getUserInput = async () => {

    const questions = [
        {
            type: 'text',
            name: 'nodeID',
            message: 'What is your NodeID ?'
        },
        {
            type: 'text',
            name: 'assignmentID',
            message: 'What is your AssignmentID ?'
        },
        {
            type: 'text',
            name: 'token',
            message: 'What is your Token ?'
        }
    ];

    const response = await prompts(questions)
    return response
}

const _parseAnswer = (string) => {
    if (/{{}}\(\)/.test(string)) return { type: 1, content: '' }
    let result = string.match(/{{.*}}/)[0]
    result = result.replace(/{{/, '')
    result = result.replace(/}}/, '')
    return {
        type: 0,
        content: result.trim().split('/')
    }
}

setImmediate(async () => {
    const userInput = await _getUserInput()
    const { nodeID, assignmentID, token } = userInput
    if (!nodeID || !assignmentID || !token) throw new Error('Missing field.')
    let response = await getQuestions(nodeID, assignmentID, token)
    const { questions } = response.data
    const questionsIDArray = questions.map(q => { return q._id })
    await Promise.all(questionsIDArray.map(async qid => {
        response = await getAnswer(qid, nodeID, assignmentID, token)
        const { question_text } = response.data
        const { type, content: answerArray } = _parseAnswer(question_text)
        if (type === 0) {
            for (let i = 0; i < answerArray.length; i++) {
                response = await submitAnswer(qid, answerArray[i], nodeID, assignmentID, token)
                const { answer_right } = response
                if (answer_right === 1) { console.log({ qid, ans: answerArray[i] }); break }
            }
        }
    }))
})