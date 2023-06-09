const getBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

document.addEventListener('DOMContentLoaded', ev => {
    const form = document.querySelector('#form');
    const inputFile = document.querySelector('#file');
    const dataBox = document.querySelector('#show-data');

    const convertFile = file => {
        dataBox.removeAttribute("hide");
        getBase64(file).then(url => {
            dataBox.querySelector("h3[file-name]").innerHTML = (file.name ? file.name : "Unknown");
            dataBox.querySelector("div[b64u]").innerHTML = (url ? url : "Unknown");
        });
    }

    window.addEventListener('dragover', ev => {
        ev.preventDefault();
        document.body.setAttribute('drag', 'true');
    });

    const preventDrag = ev => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        document.body.removeAttribute('drag');
    }

    window.addEventListener('dragleave', preventDrag);
    window.addEventListener('drop', ev => {
        preventDrag(ev);
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            const item = ev.dataTransfer.items[0];
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                convertFile(file);
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            const file = ev.dataTransfer.files[0];
            convertFile(file);
        }
    });

    form.addEventListener('change', ev => {
        if (inputFile.files.length > 0) {
            const file = inputFile.files[0];
            convertFile(file);
        };
    });

    form.addEventListener('submit', ev => ev.preventDefault());

    const reset = ev => {
        dataBox.setAttribute('hide', 'true');
        dataBox.querySelector("h3[file-name]").innerHTML = "Loading...";
        dataBox.querySelector("div[b64u]").innerHTML = "Loading...";
        form.reset();
    }

    dataBox.querySelector('#close').addEventListener("click", reset);

});