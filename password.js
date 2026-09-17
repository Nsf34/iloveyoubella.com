/* Password gate.
   Replaces the old prompt()/alert() loop, which could not be unlocked:
   the question asked for the roll name in lowercase, but the stored
   password had "135!" on the end, so the right answer was rejected.
   Now both are accepted, and the gate is an in-page form that works on phones. */
(function () {
    var QUESTION = "What is our favorite Plum Tree roll? (one word, all lowercase)";
    var ANSWERS = ["salmonlover", "salmonlover135!"];
    var KEY = "iloveyoubella-unlocked";

    function unlocked() {
        try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
    }
    function remember() {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    }
    function reveal() {
        var root = document.documentElement;
        if (root.classList) {
            root.classList.remove("gated");
        } else {
            root.className = root.className.split(/\s+/).filter(function (c) {
                return c && c !== "gated";
            }).join(" ");
        }
        var gate = document.getElementById("gate");
        if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
    }

    function build() {
        if (unlocked()) { reveal(); return; }

        var gate = document.createElement("div");
        gate.id = "gate";
        gate.innerHTML =
            '<div class="gate-card">' +
            '<h1 class="gate-title">&#10084;&#65039; I Love You Bella! &#10084;&#65039;</h1>' +
            '<label class="gate-question" for="gate-input">' + QUESTION + "</label>" +
            '<form class="gate-form" id="gate-form" autocomplete="off">' +
            '<input class="gate-input" id="gate-input" type="password" ' +
            'autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="Answer">' +
            '<button class="gate-button" type="submit">Open</button>' +
            "</form>" +
            '<p class="gate-error" id="gate-error" role="alert"></p>' +
            "</div>";
        document.body.appendChild(gate);

        var input = document.getElementById("gate-input");
        var error = document.getElementById("gate-error");
        if (input) input.focus();

        document.getElementById("gate-form").addEventListener("submit", function (e) {
            e.preventDefault();
            var given = (input.value || "").trim().toLowerCase();
            var ok = false;
            for (var i = 0; i < ANSWERS.length; i++) {
                if (given === ANSWERS[i]) { ok = true; break; }
            }
            if (ok) {
                remember();
                reveal();
            } else {
                error.textContent = "Not quite. Try again ❤️";
                input.value = "";
                input.focus();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", build);
    } else {
        build();
    }
})();
