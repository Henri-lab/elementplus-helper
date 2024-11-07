//预览 .docx 文件 (parse and render zipped XML files)
export const renderDocx = async (docxUrl) => {
    try {
        const response = await fetch(docxUrl); // Fetch the file as a binary blob
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const arrayBuffer = await response.arrayBuffer();

        // Use Mammoth.js to convert the .docx content to HTML
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        // Open a new tab and write the HTML content to it
        const newTab = window.open('', '_blank');
        if (newTab) {
            newTab.document.open();
            newTab.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document Preview</title>
                <style>
                    /* Add any necessary styles for the content */
                    body { font-family: Arial, sans-serif; padding: 20px; }
                </style>
            </head>
            <body>${result.value}</body>
            </html>
          `);
            newTab.document.close();
        } else {
            console.error('Failed to open new tab.');
        }
    } catch (error) {
        console.error(
            'Error fetching or converting the .docx file: ',
            error
        );
    }

}