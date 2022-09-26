export const createMockArray = (objectsType={}, count) => {
    return count > 0 ? [...Array(count).fill(objectsType)] : []
}