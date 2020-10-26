const getAnswer = require("./api/getAnswer")
const getQuestions = require("./api/getQuestions")
const submitAnswer = require("./api/submitAnswer")
const prompts = require('prompts')
const Bingxu = require('bingxu')

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

    const tokenHoa = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWY5NTg4YjQ2Y2YxMWViYWM0OTU0NjYzIiwicm9sZSI6Im1lbWJlciIsImlhdCI6MTYwMzYzNTM4MSwiZXhwIjoxNjAzODA4MTgxfQ.YJLzfW6szNNJqhhylwpKJXGCZcdsoqcKSXXMARAgEP4`
    if (!nodeID || !assignmentID || !token) throw new Error('Missing field.')
    let response = await getQuestions(nodeID, assignmentID, token)
    const { questions } = response.data
    const questionsIDArray = questions.map(q => { return q._id })
    await Promise.all(questionsIDArray.map(async qid => {
        response = await getAnswer(qid, nodeID, assignmentID, tokenHoa)

        const {history} = response.data
        const {current_answer} = history

        const vAnswer = current_answer[0]

        response = await submitAnswer(qid, vAnswer, nodeID, assignmentID, token)

        await Bingxu.setSleepTime(3000)
    }))
})