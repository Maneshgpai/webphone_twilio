$(function () {
    var device;

    log("Welcome to Virgolife demo");
    log("Requesting Access Token...");
    // Using a relative link to access the Voice Token function
    $.getJSON("./token")
        .then(function (data) {
            log("Got a token.");
            // console.log("Token: " + data.token);

            // Setup Twilio.Device
            device = new Twilio.Device(data.token, {
                // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
                // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
                codecPreferences: ["opus", "pcmu"],
                // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
                // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
                // a second time and sending the tone twice. This will be default in 2.0.
                fakeLocalDTMF: true,
                // Use `enableRingingState` to enable the device to emit the `ringing`
                // state. The TwiML backend also needs to have the attribute
                // `answerOnBridge` also set to true in the `Dial` verb. This option
                // changes the behavior of the SDK to consider a call `ringing` starting
                // from the connection to the TwiML backend to when the recipient of
                // the `Dial` verb answers.
                enableRingingState: true,
                debug: true,
            });

            device.on("ready", function (device) {
                log("Webphone Ready!");
            });

            device.on("error", function (error) {
                log("Webphone Error: " + error.message);
                log("Webphone Error: " + error.text);
                log("Webphone Error: " + error.debug);
            });

            device.on("connect", function (conn) {
                log('Successfully established call ! ');
                const callModal = new bootstrap.Modal(document.getElementById('modal-call-in-progress'));
                callModal.show();
            });

            device.on("disconnect", function (conn) {
                log("Call ended.");
                // Hide all modals using Bootstrap 5 syntax
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modalEl => {
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                });
            });

        })
        .catch(function (err) {
            log("Could not get a token from server!");
        });

    // Bind button to make call
    document.getElementById('btnDial').addEventListener('click', function() {
        // Hide dial modal using Bootstrap 5 syntax
        const dialModal = bootstrap.Modal.getInstance(document.getElementById('modal-dial'));
        if (dialModal) dialModal.hide();

        // get the phone number to connect the call to
        var params = {
            To: document.getElementById("phoneNumber").value
        };

        // output destination number
        $("#txtPhoneNumber").text(params.To);

        if (device) {
            var outgoingConnection = device.connect(params);
            outgoingConnection.on("ringing", function () {
                log("Ringing...");
            });
        }
    });

    // Bind button to hangup call
    document.querySelectorAll('.btnHangUp').forEach(btn => {
        btn.addEventListener('click', function() {
            // Hide all modals using Bootstrap 5 syntax
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modalEl => {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            });
            
            log("Hanging up...");
            if (device) {
                device.disconnectAll();
            }
        });
    });

    // Activity log
    function log(message) {
        var logDiv = document.getElementById("log");
        logDiv.innerHTML += "<p>&nbsp;" + message + "</p>";
        logDiv.scrollTop = logDiv.scrollHeight;
    }
});
