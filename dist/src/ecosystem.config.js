"use strict";
module.exports = {
    apps: [
        {
            name: "najotEdu",
            script: "./dist/src/main.js",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
//# sourceMappingURL=ecosystem.config.js.map