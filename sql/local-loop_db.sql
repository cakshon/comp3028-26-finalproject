CREATE TABLE Organisation (
    organisationID int,
    organisationName varchar(50),
    contactEmail varchar(50),
    approvalStatus boolean DEFAULT false,
    CONSTRAINT pk PRIMARY KEY (organisationID)
);

CREATE TABLE Users (
    userID int,
    fullName varchar(50),
    email varchar(50),
    isAdmin boolean DEFAULT false,
    createdAt date DEFAULT CURRENT_DATE,
    CONSTRAINT pk PRIMARY KEY (userID)
);

CREATE TABLE FoodListing (
    listingID int,
    organisationID int,
    listingName varchar(50) NOT NULL,
    reservationStatus bit NOT NULL,
    CONSTRAINT pk PRIMARY KEY (listingID),
    CONSTRAINT fk FOREIGN KEY (organisationID) REFERENCES Organisation
);

CREATE TABLE Reservation (
    userID int,
    listingID int,
    rAddress varchar(50),
    deliveryStatus varchar(50),
    completedAt date,
    CONSTRAINT pk PRIMARY KEY (userID, listingID),
    CONSTRAINT fk1 FOREIGN KEY (userID) REFERENCES Users,
    CONSTRAINT fk2 FOREIGN KEY (listingID) REFERENCES FoodListing
);