import { faker } from '@faker-js/faker';

const data = Array.from({ length: 2 }).map(() => ({
    id: faker.number.int(),
    check: faker.datatype.boolean(),
    label: faker.commerce.department() + '体系', // Level 1 Node
    children: Array.from({ length: 2 }, () => ({
        id: faker.number.int(),
        label: faker.location.city(), // Corrected to `faker.address.city()` for Level 2 Node: Cities
        check: faker.datatype.boolean(),
        children: Array.from({ length: 3 }, () => ({
            id: faker.number.int(),
            label: faker.company.buzzNoun(), // Level 3 Node: Building Types
            check: faker.datatype.boolean(),
            children: Array.from({ length: 3 }, () => ({
                id: faker.number.int(),
                label: faker.commerce.productName(),// Level 4 Node
                check: faker.datatype.boolean() // Corrected to `faker.datatype.boolean()`
            }))
        }))
    }))
}));

export default data;