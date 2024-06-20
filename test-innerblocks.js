const object = {
    "innerBlocks": [
        {
            "innerBlocks": [
                {
                    "innerBlocks": [],
                    "name": "core/paragraph",
                    "attributes": {
                        "content": "Once upon a time, in a galaxy far, far away, there was a space cat named Whiskers."
                    }
                },
                {
                    "innerBlocks": [],
                    "name": "core/paragraph",
                    "attributes": {
                        "content": "Whiskers lived aboard the spaceship \"The Feline Explorer\" with its human crew. Every day was an adventure."
                    }
                }
            ],
            "name": "core/column",
            "attributes": {}
        },
        {
            "innerBlocks": [
                {
                    "innerBlocks": [],
                    "name": "core/paragraph",
                    "attributes": {
                        "content": "One day, the ship encountered a strange anomaly. Whiskers, being the brave cat he was, decided to investigate."
                    }
                },
                {
                    "innerBlocks": [],
                    "name": "core/paragraph",
                    "attributes": {
                        "content": "With his keen senses and swift agility, Whiskers discovered an alien artifact that held the key to saving the galaxy."
                    }
                }
            ],
            "name": "core/column",
            "attributes": {}
        }
    ],
    "status": "updating_inner_blocks",
    "clientId": "797d9c51-50e7-4fea-9fb1-826644c80e09",
    "valid": true,
    "name": "core/columns",
    "attributes": {}
};


function prepareBlockStructure(obj) {
    if (typeof obj === 'object') {
        for (let key in obj) {
            if (key === 'blockName') {
                obj.name = obj.blockName;
                delete obj.blockName;
            } else if (key === 'attrs') {
                obj.attributes = obj.attrs;
                delete obj.attrs;
            } else if (key === 'content') {
                if (obj.attributes) {
                    obj.attributes.content = obj.content;
                    delete obj.content;
                }
            } else if (typeof obj[key] === 'object') {
                prepareBlockStructure(obj[key]);
            }
        }
    }
    return obj;
}

prepareBlockStructure(object);


const blockName = object.name;
const attributes = object.attrs;
if (object.content) {
    attributes.content = object.content;
}
const innerBlocks = object.innerBlocks;


wp.domReady(() => {
    setTimeout(() => {
        console.log('innerBlocks', innerBlocks);
        const theInnerBlocks = wp.blocks.createBlocksFromInnerBlocksTemplate(innerBlocks);
        const theBlock = wp.blocks.createBlock(blockName, attributes, theInnerBlocks);
        const insertedBlock = wp.data.dispatch('core/editor').insertBlocks(theBlock);
        console.log(insertedBlock);
    }, 2000);

});
