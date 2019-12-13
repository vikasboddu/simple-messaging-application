CREATE TABLE IF NOT EXISTS users(
                                    id BIGINT AUTO_INCREMENT,
                                    username VARCHAR(255) NOT NULL,
                                    created_at TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
                                    INDEX(username),
                                    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS threads(
                                      id BIGINT AUTO_INCREMENT,
                                      created_at TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
                                      PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_in_thread(
        user_id BIGINT,
        thread_id BIGINT,
        created_at TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (user_id, thread_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (thread_id) REFERENCES threads(id)
);

CREATE TABLE IF NOT EXISTS messages(
                                       id BIGINT AUTO_INCREMENT,
                                       user_id BIGINT,
                                       thread_id BIGINT,
                                       message TEXT NOT NULL,
                                       created_at TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
                                       PRIMARY KEY (id),
                                       FOREIGN KEY (user_id) REFERENCES users(id),
                                       FOREIGN KEY (thread_id) REFERENCES threads(id)
);