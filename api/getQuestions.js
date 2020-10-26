const axios = require('axios')

module.exports = async (nodeID, assignmentID, token) => {
    const config = {
        method: 'get',
        url: `https://cauhoi-api.sachmem.vn/api/questions?node_id=${nodeID}&assignment_id=${assignmentID}&try_again=`,
        headers: {
            'x-access-token': `${token}`,
        }
    }

    const reponse = await axios(config)
    return reponse.data
}