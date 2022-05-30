const instance = new Neode('neo4j+s://69884cf3.databases.neo4j.io', 'neo4j', 'UAYHTgTTPcry3Tr4Gb9_4aG97GkY4wTiYioukAZIqkA');

instance.model('Person', {
    book_id: {
        primary: true,
        type: 'uuid',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    payroll: {
        type: 'number',
        unique: 'true', // Creates a Unique Constraint
    },
    title: {
        type: 'string',
        index: true, // Creates an Index
    },
    age: 'number' // Simple schema definition of property : type
});