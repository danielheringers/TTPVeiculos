const request = require('supertest');
const { app } = require('../src/app');
import { database } from "../src/database/database";
import { closeServerAndDatabase } from "../src/server";

let testCar = {
  licenseplate: `Placa${Math.floor(Math.random() * 10001)}`,
  color: `Cor ${Math.floor(Math.random() * 10001)}`,
  brand: `Marca ${Math.floor(Math.random() * 10001)}`,
};

let testDriver = {
  name: `Motorista${Math.floor(Math.random() * 10001)}`,
  cnh: `007${Math.floor(Math.random() * 10001)}`,
};

let testUtilization = {
  driverId: testDriver[0],
  carId: testCar[0],
  reasonforuse: `Ir ao cliente ${Math.floor(Math.random() * 10)}`
};

beforeAll(async () => {
  database.query("DELETE FROM carutilization;  DELETE FROM cars;  DELETE FROM drivers;")
});

afterAll(async () => {
  await closeServerAndDatabase();
});

describe("Testes rota /cars", () => {
  it("Testando criacao de carros", async () => {
    const response = await request(app).post("/cars").send(testCar);

    testCar.id = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.licenseplate).toContain("Placa");
  });

  it("Testando listagem de todos carros", async () => {
    const response = await request(app).get("/cars");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].licenseplate).toContain("Placa");
  });

  it("Testando listagem de um carros", async () => {
    const response = await request(app).get(`/cars/${testCar.licenseplate}`);

    expect(response.status).toBe(200);
    expect(response.body.licenseplate).toContain("Placa");
  });

  it("Testando atualizacao de um carro especifico", async () => {
    const response = await request(app)
      .patch(`/cars/update/${testCar.licenseplate}`)
      .send({
        licenseplate: `PlacaTeste`,
      });

    expect(response.status).toBe(200);
    expect(response.body.licenseplate).toContain("PlacaTeste");
  });
  it("Testando delecao de um carro", async () => {
    const response = await request(app).delete(
      `/cars/${testCar.licenseplate}`
    );

    expect(response.status).toBe(204);
  });
});


//Testes Drivers
describe("Testes rota /drivers", () => {
  it("Testando criacao de motoristas", async () => {
    const response = await request(app).post("/drivers").send(testDriver);

    testDriver.id = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toContain("Motorista");
  });

  it("Testando listagem de todos motoristas", async () => {
    const response = await request(app).get("/drivers");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toContain("Motorista");
  });

  it("Testando listagem de um motoristas", async () => {
    const response = await request(app).get(`/drivers/${testDriver.name}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toContain("Motorista");
  });

  it("Testando atualizacao de um motorista especifico", async () => {
    const response = await request(app)
      .patch(`/drivers/update/${testDriver.cnh}`)
      .send({
        name: `MotoristaTeste`,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toContain("MotoristaTeste");
  });
  it("Testando delecao de um motorista", async () => {
    const response = await request(app).delete(
      `/drivers/${testDriver.name}`
    );

    expect(response.status).toBe(204);
  });
});


// Testes Utilizações
describe("Testes rota /carutilization", () => {
  it("Testando criacao de utilizacao", async () => {
    // Criar um carro para ser utilizado
    const carResponse = await request(app).post("/cars").send(testCar);
    testCar.id = carResponse.body.id;

    // Criar um motorista para a utilização
    const driverResponse = await request(app).post("/drivers").send(testDriver);
    testDriver.id = driverResponse.body.id;

    // Criar uma utilização
    const utilizationResponse = await request(app)
      .post("/carutilization/start")
      .send({
        driverId: testDriver.id,
        carId: testCar.id,
        reasonforuse: testUtilization.reasonforuse,
      });

    testUtilization.id = utilizationResponse.body.id;

    expect(utilizationResponse.status).toBe(201);
  });

  it("Testando listagem de todas utilizações", async () => {
    const response = await request(app).get("/carutilization");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].initialdate).toContain("2023");
  });

  it("Testando finalizacao de utilizacao", async () => {
    const response = await request(app)
      .post(`/carutilization/end/${testDriver.id}`)
      .send({});

    expect(response.status).toBe(200);
  });
});
