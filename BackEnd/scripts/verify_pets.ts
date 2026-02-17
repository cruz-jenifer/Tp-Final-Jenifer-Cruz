
import { login } from '../src/services/auth.service';
import { MascotaController } from '../src/controllers/mascota.controller';
import { pool } from '../src/config/database';

// Mock Express Request/Response
const mockRequest = (user: any) => ({
    user,
    params: {},
    body: {}
});

const mockResponse = () => {
    const res: any = {};
    res.status = (code: number) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data: any) => {
        console.log('RESPONSE JSON:', JSON.stringify(data, null, 2));
        return res;
    };
    return res;
};

async function verify() {
    try {
        console.log('--- LOGGING IN AS LAURA ---');
        const auth = await login({ email: 'laura@feat4.com', password: '123456' });
        console.log('Logged in. User ID:', auth.user.id);

        console.log('--- FETCHING PETS ---');
        const req: any = mockRequest({ id: auth.user.id, rol: 'cliente' });
        const res: any = mockResponse();

        await MascotaController.listarMisMascotas(req, res, (err: any) => console.error(err));

    } catch (e) {
        console.error(e);
    }
    process.exit();
}

verify();
