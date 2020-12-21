const getAnswer = require("./api/getAnswer")
const getQuestions = require("./api/getQuestions")
const submitAnswer = require("./api/submitAnswer")
const prompts = require('prompts')
const Bingxu = require('bingxu')
const fs = require('fs')
const Promise = require('bluebird')
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
        }
    ];

    const response = await prompts(questions)
    return response
}

const _parseAnswer = (string) => {
    if (/{{}}\(\)/.test(string)) return {type: 1, content: ''}
    let result = string.match(/{{.*}}/)[0]
    result = result.replace(/{{/, '')
    result = result.replace(/}}/, '')
    return {
        type: 0,
        content: result.trim().split('/')
    }
}

const parseQuestion = (question) => {
    const find = /">(.*)\n/gmi.exec(`${question}`)

    return find[1]
}

const parseAnswer = (question) => {
    const find = /">{{(.*)\n/gmi.exec(`${question}`)

    return find[1]
}

const parseQuestionFill = (question) => {

    console.log({question})
    const find = /">{{}}\(\) (.*)\n/gmi.exec(`${question}`)

    return find[1]
}

setImmediate(async () => {
    // const userInput = await _getUserInput()
    // const { nodeID, assignmentID } = userInput

    //5f93bc136cf11ebac492e416
    //5f93bda46cf11ebac492e55b

    //5f93bc136cf11ebac492e417
    //5f93bda46cf11ebac492e55c

    //5f93bc136cf11ebac492e418
    //5f93bda46cf11ebac492e55d

    //5f93bc136cf11ebac492e419
    //5f93bda46cf11ebac492e55e

    const listQuest = [
        {
            nodeId: "5f93bc136cf11ebac492e41c",
            assignmentID: "5f93bda46cf11ebac492e561"
        },
        {
            nodeId: "5f93bc136cf11ebac492e41d",
            assignmentID: "5f93bda46cf11ebac492e562"
        },
        // {
        //     nodeId: "5f93bc136cf11ebac492e416",
        //     assignmentID: "5f93bda46cf11ebac492e55b"
        // },
        // {
        //     nodeId: "5f93bc136cf11ebac492e417",
        //     assignmentID: "5f93bda46cf11ebac492e55c"
        // },
        // {
        //     nodeId: "5f93bc136cf11ebac492e418",
        //     assignmentID: "5f93bda46cf11ebac492e55d"
        // },
        // {
        //     nodeId: "5f93bc136cf11ebac492e419",
        //     assignmentID: "5f93bda46cf11ebac492e55e"
        // },
        // {
        //     nodeId: "5f93bc136cf11ebac492e41a",
        //     assignmentID: "5f93bda46cf11ebac492e55f"
        // },
        // {
        //     nodeId: "5f93bc136cf11ebac492e41b",
        //     assignmentID: "5f93bda46cf11ebac492e560"
        // },
    ]

    await Promise.each(listQuest, async (quest) => {
        const nodeID = quest.nodeId
        const assignmentID = quest.assignmentID
        const tokenHoa = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWY5NTg4YjQ2Y2YxMWViYWM0OTU0NjYzIiwicm9sZSI6Im1lbWJlciIsImlhdCI6MTYwNjY0OTU5NiwiZXhwIjoxNjA2ODIyMzk2fQ.szfFn5iCF4AyL6Z0Wug3S3lFO4W_NAhrKvJ4pezXYDU`
        if (!nodeID || !assignmentID || !tokenHoa) throw new Error('Missing field.')
        let response = await getQuestions(nodeID, assignmentID, tokenHoa)
        const {questions} = response.data
        const questionsIDArray = questions.map(q => {
            return q._id
        })
        let dataString = ''

        await Promise.each(questionsIDArray, (async (qid, index) => {
            response = await getAnswer(qid, nodeID, assignmentID, tokenHoa)

            const {instruction} = response.data

            const ques = parseQuestion(instruction)

            dataString += index + 1 + '. ' + ques + '\n'

            let {question_text} = response.data

            question_text = parseQuestion(question_text)
            question_text = question_text.split('/')

            question_text = question_text.join('. \n')

            console.log({question_text})

            dataString += question_text + '\n'

            // console.log({instruction})
            // const ques = parseQuestion(instruction)

            const {history} = response.data

            if (history) {
                let {current_answer} = history
                if (current_answer) {
                    console.log({current_answer})
                    current_answer = current_answer.join(',')
                    let vAnswer = current_answer || ''

                    console.log({vAnswer})
                    dataString += "ANS:" + vAnswer + '\n\n'
                    // if (ques === 'Điền vào chỗ trống') {
                    //     const {question_text} = response.data
                    //
                    //     vAnswer += ',FILL:' + parseQuestion(question_text)
                    // }

                    // arrays += `QUEST: ${ques}---ANS: ${vAnswer}\n`
                }

            }
        }))

        dataString += '----------------------------\n'

        await fs.appendFileSync("./data3.txt", dataString)
    })


    // console.log(answers)
})