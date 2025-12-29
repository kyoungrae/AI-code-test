class JwtUtils {
    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    static base64UrlDecode(base64Url) {
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        while (base64.length % 4) {
            base64 += '=';
        }

        return atob(base64);
    }

    static decodeJWT(jwt) {
        const parts = jwt.split('.');
        const payloadBase64 = parts[1];
        const decodedPayload = JSON.parse(JwtUtils.base64UrlDecode(payloadBase64));

        return decodedPayload;
    }

    static getUserEmailFromJWT() {
        const jwt = JwtUtils.getCookie('Authorization');

        if (!jwt) {
            console.log("Authorization JWT를 찾을 수 없습니다.");
            return null;
        }

        try {
            const decoded = JwtUtils.decodeJWT(jwt);
            const userEmail = decoded.sub;

            return userEmail;
        } catch (error) {
            console.error("JWT 디코딩 오류:", error);
            return null;
        }
    }
}