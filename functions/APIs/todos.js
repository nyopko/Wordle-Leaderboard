const { db } = require('../util/admin');

exports.getAllScores = (request, response) => {
	db
		.collection('todos')
		.orderBy('createAt', 'desc')
		.get()
		.then((data) => {
			let todos = [];
			data.forEach((doc) => {
				todos.push({
                    todoId: doc.id,
                    score: doc.data().score,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(todos);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.postOneScore = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(!typeof request.body.score === "number") {
        return response.status(400).json({ score: 'Must not be empty' });
    }
    
    const newTodoItem = {
        score: request.body.score,
        body: request.body.body,
        createAt: new Date().toISOString()
    }
    db
        .collection('todos')
        .add(newTodoItem)
        .then((doc)=>{
            const responseTodoItem = newTodoItem;
            responseTodoItem.id = doc.id;
            return response.json(responseTodoItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};
