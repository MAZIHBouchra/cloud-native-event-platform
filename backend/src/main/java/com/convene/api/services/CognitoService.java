package com.convene.api.services;

import com.convene.api.dtos.SignInRequestDto;
import com.convene.api.dtos.SignUpRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * This service contains the business logic for interacting with AWS Cognito.
 * It handles the creation of users and the authentication process.
 */
@Service
public class CognitoService {

    @Autowired
    private CognitoIdentityProviderClient cognitoClient;

    @Value("${aws.cognito.userPoolId}")
    private String userPoolId;

    @Value("${aws.cognito.appClientId}")
    private String appClientId;

    @Value("${aws.cognito.appClientSecret}")
    private String appClientSecret;

    /**
     * Registers a new user in the Cognito User Pool and assigns them to a group based on their role.
     * @param request The SignUpRequestDto containing user details.
     * @throws CognitoIdentityProviderException if the user already exists or another Cognito error occurs.
     */
    public void signUp(SignUpRequestDto request) {
        // 1. Create the user in Cognito with required attributes
        String secretHash = calculateSecretHash(appClientId, appClientSecret, request.getEmail());
        SignUpRequest cognitoSignUpRequest = SignUpRequest.builder()
                .clientId(appClientId)
                .username(request.getEmail())
                .password(request.getPassword())
                .secretHash(secretHash)
                .userAttributes(
                        AttributeType.builder().name("email").value(request.getEmail()).build(),
                        AttributeType.builder().name("given_name").value(request.getFirstName()).build(),
                        AttributeType.builder().name("family_name").value(request.getLastName()).build()
                )
                .build();
        cognitoClient.signUp(cognitoSignUpRequest);

        // 2. Add the newly created user to the appropriate group (Organizers or Participants)
        // This is an administrative action, so we use an admin-level call.
        String groupName = "ORGANIZER".equalsIgnoreCase(request.getRole()) ? "Organizers" : "Participants";

        AdminAddUserToGroupRequest addUserToGroupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(userPoolId)
                .username(request.getEmail())
                .groupName(groupName)
                .build();
        cognitoClient.adminAddUserToGroup(addUserToGroupRequest);
    }

    /**
     * Authenticates a user with Cognito using their email and password.
     * @param request The SignInRequestDto containing user credentials.
     * @return The AuthenticationResultType containing JWT tokens if authentication is successful.
     * @throws CognitoIdentityProviderException if authentication fails (e.g., incorrect password, user not found).
     */
    public AuthenticationResultType signIn(SignInRequestDto request) {
    // AJOUT 1 : Calculez le secret hash pour la demande de connexion
    String secretHash = calculateSecretHash(appClientId, appClientSecret, request.getEmail());

    Map<String, String> authParameters = new HashMap<>();
    authParameters.put("USERNAME", request.getEmail());
    authParameters.put("PASSWORD", request.getPassword());
    // AJOUT 2 : Ajoutez le secret hash aux paramètres d'authentification
    authParameters.put("SECRET_HASH", secretHash);

    InitiateAuthRequest authRequest = InitiateAuthRequest.builder()
            .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
            .clientId(appClientId)
            .authParameters(authParameters)
            .build();

    InitiateAuthResponse response = cognitoClient.initiateAuth(authRequest);
    return response.authenticationResult();
}

public String getUserRole(String username) {
    try {
        AdminListGroupsForUserRequest request = AdminListGroupsForUserRequest.builder()
                .userPoolId(userPoolId)
                .username(username)
                .build();

        AdminListGroupsForUserResponse response = cognitoClient.adminListGroupsForUser(request);
        List<GroupType> groups = response.groups();

        // On regarde si l'utilisateur est dans le groupe "Organizers"
        for (GroupType group : groups) {
            if (group.groupName().equalsIgnoreCase("Organizers")) {
                return "ORGANIZER"; // On renvoie le mot-clé attendu par le Frontend
            }
        }
        return "PARTICIPANT"; // Par défaut
    } catch (Exception e) {
        System.err.println("Erreur lors de la récupération du rôle : " + e.getMessage());
        return "PARTICIPANT"; // En cas d'erreur, on considère que c'est un participant
    }
}

    private String calculateSecretHash(String clientId, String clientSecret, String userName) {
        final String HMAC_SHA256_ALGORITHM = "HmacSHA256";
        SecretKeySpec signingKey = new SecretKeySpec(
                clientSecret.getBytes(StandardCharsets.UTF_8),
                HMAC_SHA256_ALGORITHM);
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
            mac.init(signingKey);
            mac.update(userName.getBytes(StandardCharsets.UTF_8));
            byte[] rawHmac = mac.doFinal(clientId.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error while calculating Secret Hash", e);
        }
    }
}