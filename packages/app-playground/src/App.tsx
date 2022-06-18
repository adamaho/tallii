import React from "react";

import { Button } from "@tallii/web-button";

import * as styles from "./App.css";

function App() {
    return (
        <div className={styles.app}>
            <div className={styles.dialog}>
                <h3 className={styles.dialogTitle}>are you sure?</h3>
                <p className={styles.dialogDescription}>
                    this action cannot be undone. this will permanently delete
                    your account and remove all of your data.
                </p>
                <div className={styles.dialogFooter}>
                    <Button.Root variant="text">
                        <Button.Text>cancel</Button.Text>
                    </Button.Root>
                    <Button.Root variant="primary">
                        <Button.Text>save</Button.Text>
                    </Button.Root>
                </div>
            </div>
        </div>
    );
}

export default App;
