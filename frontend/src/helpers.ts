export const fileNameHandler = (filename: string) => {
    let transformedFileName = filename;
    if (transformedFileName.length > 24) {
        transformedFileName = `${transformedFileName.slice(0, 18)}...${transformedFileName.split('.').pop()}`
    }
    return transformedFileName;
}