CREATE TABLE cars (
	ID SERIAL PRIMARY KEY,
    licenseplate VARCHAR(10) UNIQUE,
    color VARCHAR(50),
    brand VARCHAR(50),
	deleted BOOLEAN DEFAULT false
);
CREATE TABLE drivers (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
	cnh VARCHAR(50) NOT NULL UNIQUE,
	deleted BOOLEAN DEFAULT false
);
CREATE TABLE carutilization (
    ID SERIAL PRIMARY KEY,
    initialdate TIMESTAMP,
    enddate TIMESTAMP,
    driverid INTEGER REFERENCES drivers(ID),
    carid INTEGER REFERENCES cars(ID),
    reasonforuse VARCHAR(255)
);