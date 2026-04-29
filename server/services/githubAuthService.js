import axios from "axios";

export const githubAuth = async (code) => {
    try {
        const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: "application/json" } }
        );

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const emailRes = await axios.get(
            "https://api.github.com/user/emails",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const primaryEmail = emailRes.data.find(e => e.primary)?.email;


        return {
            name: userRes.data.name,
            picture: userRes.data.avatar_url,
            email: primaryEmail,
        };

    } catch (err) {
        console.error(err);
    }
}