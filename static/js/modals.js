document.addEventListener('DOMContentLoaded', function () {
    //////////////          DIAL MODAL         ///////////////////////////////

    let btnOpenNumberPad = document.getElementById('btnOpenNumberPad');
    let inputPhoneNumber = document.getElementById('phoneNumber');
    let btnDelete = document.getElementById('btnDelete');

    btnOpenNumberPad.addEventListener('click', (event) => {
        const dialModal = new bootstrap.Modal(document.getElementById('modal-dial'));
        dialModal.show();
    });

    document.getElementById('btnCloseDialModal').addEventListener('click', function () {
        const dialModal = bootstrap.Modal.getInstance(document.getElementById('modal-dial'));
        if (dialModal) dialModal.hide();
    });

    document.querySelectorAll('.btnNumber').forEach(btn => {
        btn.addEventListener('click', function () {
            let text = this.textContent;
            inputPhoneNumber.value += text;
        });
    });

    btnDelete.addEventListener('click', (event) => {
        console.log('clicked', event);
        var str = inputPhoneNumber.value;
        var position = inputPhoneNumber.selectionStart - 1;

        str = str.substr(0, position) + '' + str.substr(position + 1);
        inputPhoneNumber.value = str;
    });

    ///////////////       CALL IN PROGRESS MODAL          ////////////////////////////

    const callProgressModal = document.getElementById('modal-call-in-progress');
    if (callProgressModal) {
        callProgressModal.addEventListener('shown.bs.modal', function () {
            showCallDuration();
        });
    }

    function showCallDuration() {
        let output = document.getElementById('callDuration');
        let ms = 0;
        let sec = 0;
        let min = 0;
        let time;

        function timer() {
            ms++;
            if (ms >= 100) {
                sec++;
                ms = 0;
            }
            if (sec === 60) {
                min++;
                sec = 0;
            }
            if (min === 60) {
                ms = 0;
                sec = 0;
                min = 0;
            }

            let seconds = sec < 10 ? `0${sec}` : sec;
            let minute = min < 10 ? `0${min}` : min;

            let timer = `${minute}:${seconds}`;
            output.innerHTML = timer;
        }

        // Start timer
        function start() {
            time = setInterval(timer, 10);
        }

        // Stop timer
        function stop() {
            clearInterval(time);
        }

        // Reset timer
        function reset() {
            ms = 0;
            sec = 0;
            min = 0;
            output.innerHTML = `00:00`;
        }

        // Start the timer
        start();

        // Stop timer when modal is hidden
        callProgressModal.addEventListener('hidden.bs.modal', function () {
            stop();
        });
    }
});
